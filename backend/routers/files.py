from fastapi import APIRouter, HTTPException, UploadFile, File, Form
import docker
import asyncio
import io
import tarfile

router = APIRouter(prefix="/api/files", tags=["Files"])

@router.get("/{container_id}/list")
async def list_files(container_id: str, path: str = "/tmp"):
    client = docker.from_env()
    try:
        container = client.containers.get(container_id)
        cmd = f"ls -l --time-style=+%Y-%m-%d_%H:%M:%S {path}"
        exit_code, output = await asyncio.to_thread(container.exec_run, cmd)
        
        # If directory doesn't exist or ls fails
        if exit_code != 0:
            return []
        
        lines = output.decode('utf-8').strip().split('\n')
        files = []
        for line in lines:
            if not line or line.startswith("total ") or line.startswith("ls:"): continue
            parts = line.split()
            if len(parts) >= 7:
                perms = parts[0]
                size = parts[4]
                date = parts[5].replace("_", " ")
                name = " ".join(parts[6:])
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
    client = docker.from_env()
    try:
        container = client.containers.get(container_id)
        content = await file.read()
        
        tar_stream = io.BytesIO()
        with tarfile.open(fileobj=tar_stream, mode='w') as tar:
            tarinfo = tarfile.TarInfo(name=file.filename)
            tarinfo.size = len(content)
            tar.addfile(tarinfo, io.BytesIO(content))
        tar_stream.seek(0)
        
        await asyncio.to_thread(container.put_archive, path, tar_stream)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
