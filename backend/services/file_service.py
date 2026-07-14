import os
import shutil
import zipfile
import aiofiles
from pathlib import Path
from fastapi import UploadFile
from schemas.files import FileInfo
from utils.exceptions import ResourceNotFound
from typing import List, Optional

class FileService:
    BASE_DIR = Path.home() / "vnav_data"
    
    def __init__(self):
        self.BASE_DIR.mkdir(parents=True, exist_ok=True)

    def _resolve_path(self, req_path: str) -> Path:
        # Prevent path traversal
        clean_path = req_path.lstrip("/")
        target_path = (self.BASE_DIR / clean_path).resolve()
        if not target_path.is_relative_to(self.BASE_DIR.resolve()):
            raise ResourceNotFound("Path is outside the workspace.")
        return target_path

    async def list_files(self, path: str = "") -> list[FileInfo]:
        target_dir = self._resolve_path(path)
        if not target_dir.is_dir():
            raise ResourceNotFound("Directory not found.")
            
        files = []
        for entry in os.scandir(target_dir):
            stat = entry.stat()
            rel_path = Path(entry.path).relative_to(self.BASE_DIR)
            files.append(FileInfo(
                name=entry.name,
                path=str(rel_path).replace("\\", "/"),
                is_dir=entry.is_dir(),
                size=stat.st_size,
                modified=stat.st_mtime
            ))
        return files

    async def get_tree(self, path: str = "") -> dict:
        target_dir = self._resolve_path(path)
        if not target_dir.is_dir():
            raise ResourceNotFound("Directory not found.")
            
        def _build_tree(curr_path: Path):
            children = []
            for entry in os.scandir(curr_path):
                stat = entry.stat()
                rel_path = Path(entry.path).relative_to(self.BASE_DIR)
                node = {
                    "name": entry.name,
                    "path": str(rel_path).replace("\\", "/"),
                    "is_dir": entry.is_dir(),
                    "size": stat.st_size,
                    "modified": stat.st_mtime
                }
                if entry.is_dir():
                    node["children"] = _build_tree(Path(entry.path))
                children.append(node)
            return children

        return {"name": "root", "path": "", "is_dir": True, "children": _build_tree(target_dir)}

    async def read_file(self, path: str) -> str:
        target_file = self._resolve_path(path)
        if not target_file.is_file():
            raise ResourceNotFound("File not found.")
        async with aiofiles.open(target_file, mode='r', encoding='utf-8') as f:
            return await f.read()

    async def write_file(self, path: str, content: str) -> FileInfo:
        target_file = self._resolve_path(path)
        async with aiofiles.open(target_file, mode='w', encoding='utf-8') as f:
            await f.write(content)
            
        stat = os.stat(target_file)
        rel_path = target_file.relative_to(self.BASE_DIR)
        return FileInfo(
            name=target_file.name,
            path=str(rel_path).replace("\\", "/"),
            is_dir=False,
            size=stat.st_size,
            modified=stat.st_mtime
        )

    async def save_file(self, file: UploadFile, dest_path: str = "") -> FileInfo:
        target_dir = self._resolve_path(dest_path)
        if not target_dir.is_dir():
            target_dir.mkdir(parents=True, exist_ok=True)
            
        file_path = target_dir / (file.filename or "upload")
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)
        
        stat = os.stat(file_path)
        rel_path = file_path.relative_to(self.BASE_DIR)
        return FileInfo(
            name=file_path.name,
            path=str(rel_path).replace("\\", "/"),
            is_dir=False,
            size=stat.st_size,
            modified=stat.st_mtime
        )

    async def delete_file(self, path: str):
        target = self._resolve_path(path)
        if not target.exists():
            raise ResourceNotFound("Path not found.")
        if target.is_file():
            target.unlink()
        else:
            shutil.rmtree(target)

    async def mkdir(self, path: str, name: str) -> FileInfo:
        target_dir = self._resolve_path(path)
        new_dir = target_dir / name
        if not new_dir.is_relative_to(self.BASE_DIR.resolve()):
            raise ResourceNotFound("Invalid path")
        new_dir.mkdir(parents=True, exist_ok=True)
        
        stat = os.stat(new_dir)
        rel_path = new_dir.relative_to(self.BASE_DIR)
        return FileInfo(
            name=new_dir.name,
            path=str(rel_path).replace("\\", "/"),
            is_dir=True,
            size=stat.st_size,
            modified=stat.st_mtime
        )

    async def rename(self, path: str, new_name: str) -> FileInfo:
        target = self._resolve_path(path)
        new_target = target.parent / new_name
        if not target.exists():
            raise ResourceNotFound("Path not found.")
        if not new_target.is_relative_to(self.BASE_DIR.resolve()):
            raise ResourceNotFound("Invalid target path")
            
        target.rename(new_target)
        
        stat = os.stat(new_target)
        rel_path = new_target.relative_to(self.BASE_DIR)
        return FileInfo(
            name=new_target.name,
            path=str(rel_path).replace("\\", "/"),
            is_dir=new_target.is_dir(),
            size=stat.st_size,
            modified=stat.st_mtime
        )

    async def move(self, source_path: str, dest_path: str):
        source = self._resolve_path(source_path)
        dest = self._resolve_path(dest_path)
        if not source.exists():
            raise ResourceNotFound("Source not found.")
        shutil.move(str(source), str(dest))

    async def copy(self, source_path: str, dest_path: str):
        source = self._resolve_path(source_path)
        dest = self._resolve_path(dest_path)
        if not source.exists():
            raise ResourceNotFound("Source not found.")
        if source.is_file():
            shutil.copy2(str(source), str(dest))
        else:
            shutil.copytree(str(source), str(dest))

    async def compress(self, paths: list[str], dest_path: str, format: str = "zip"):
        dest = self._resolve_path(dest_path)
        if format == "zip":
            with zipfile.ZipFile(str(dest), 'w', zipfile.ZIP_DEFLATED) as zipf:
                for p in paths:
                    src = self._resolve_path(p)
                    if src.is_file():
                        zipf.write(src, src.name)
                    else:
                        for root, _, files in os.walk(src):
                            for file in files:
                                file_path = Path(root) / file
                                arcname = file_path.relative_to(src.parent)
                                zipf.write(file_path, arcname)

    async def extract(self, path: str, dest_path: str):
        source = self._resolve_path(path)
        dest = self._resolve_path(dest_path)
        if source.suffix == ".zip":
            with zipfile.ZipFile(str(source), 'r') as zipf:
                zipf.extractall(str(dest))
