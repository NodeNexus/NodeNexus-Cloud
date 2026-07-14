import os
import aiofiles
from pathlib import Path
from fastapi import UploadFile
from schemas.files import FileInfo
from utils.exceptions import ResourceNotFound

class FileService:
    BASE_DIR = Path.home() / "vnav_data"
    
    def __init__(self):
        self.BASE_DIR.mkdir(parents=True, exist_ok=True)

    async def list_files(self) -> list[FileInfo]:
        files = []
        for entry in os.scandir(self.BASE_DIR):
            stat = entry.stat()
            files.append(FileInfo(
                name=entry.name,
                path=entry.path,
                is_dir=entry.is_dir(),
                size=stat.st_size,
                modified=stat.st_mtime
            ))
        return files

    async def save_file(self, file: UploadFile) -> FileInfo:
        file_path = self.BASE_DIR / file.filename
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)
        
        stat = os.stat(file_path)
        return FileInfo(
            name=file.filename,
            path=str(file_path),
            is_dir=False,
            size=stat.st_size,
            modified=stat.st_mtime
        )

    async def delete_file(self, path: str):
        target = Path(path)
        if not target.is_relative_to(self.BASE_DIR):
            raise ResourceNotFound("Invalid file path.")
        if target.exists() and target.is_file():
            target.unlink()
        else:
            raise ResourceNotFound("File not found.")
