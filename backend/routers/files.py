from fastapi import APIRouter, HTTPException, UploadFile, File, Form
import docker
import asyncio
import io
import tarfile
from core.security import sanitize_path

router = APIRouter(prefix="/api/files", tags=["Files"])

# P0: Cap individual file upload size at 50MB
MAX_UPLOAD_BYTES = 50 * 1024 * 1024


@router.get("/{container_id}/list")
async def list_files(container_id: str, path: str = "/tmp"):
    # P0: Sanitize the path before passing to docker exec
    try:
        safe_path = sanitize_path(path, container_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    client = docker.from_env()
    try:
        container = client.containers.get(container_id)
    except docker.errors.NotFound:
        raise HTTPException(status_code=404, detail=f"Container '{container_id}' not found or has stopped.")

    try:
        cmd = ["ls", "-l", "--time-style=+%Y-%m-%d_%H:%M:%S", safe_path]
        exit_code, output = await asyncio.to_thread(container.exec_run, cmd)

        if exit_code != 0:
            return []

        lines = output.decode('utf-8').strip().split('\n')
        files = []
        for line in lines:
            if not line or line.startswith("total ") or line.startswith("ls:"):
                continue
            parts = line.split()
            if len(parts) >= 7:
                perms = parts[0]
                size = parts[4]
                date = parts[5].replace("_", " ")
                name = " ".join(parts[6:])
                # P0: Skip hidden symlinks pointing outside safe roots (e.g. /proc links)
                if name in (".", ".."): continue
                is_dir = perms.startswith('d')
                files.append({
                    "name": name,
                    "type": "folder" if is_dir else "file",
                    "size": f"{size} B" if not is_dir else "--",
                    "modified": date
                })
        return files
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{container_id}/upload")
async def upload_file(container_id: str, path: str = Form(...), file: UploadFile = File(...)):
    # P0: Sanitize the destination path
    try:
        safe_path = sanitize_path(path, container_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    client = docker.from_env()
    try:
        container = client.containers.get(container_id)
    except docker.errors.NotFound:
        raise HTTPException(status_code=404, detail=f"Container '{container_id}' not found or has stopped.")

    try:
        content = await file.read(MAX_UPLOAD_BYTES + 1)
        if len(content) > MAX_UPLOAD_BYTES:
            raise HTTPException(status_code=413, detail="File exceeds 50MB upload limit.")

        # P0: Sanitize the filename — strip any directory components
        safe_filename = os.path.basename(file.filename or "upload.bin")
        if not safe_filename:
            safe_filename = "upload.bin"

        tar_stream = io.BytesIO()
        with tarfile.open(fileobj=tar_stream, mode='w') as tar:
            tarinfo = tarfile.TarInfo(name=safe_filename)
            tarinfo.size = len(content)
            tar.addfile(tarinfo, io.BytesIO(content))
        tar_stream.seek(0)

        await asyncio.to_thread(container.put_archive, safe_path, tar_stream)
        return {"status": "success", "path": safe_path, "filename": safe_filename}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Need os for basename
import os
