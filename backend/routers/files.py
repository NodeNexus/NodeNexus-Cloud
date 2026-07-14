from fastapi import APIRouter, UploadFile, File, Depends, Form
from schemas.files import (
    FileInfo, FileDeleteRequest, FileRenameRequest, FileMoveRequest, 
    FileCopyRequest, FileMkdirRequest, FileWriteRequest, 
    FileCompressRequest, FileExtractRequest
)
from services.file_service import FileService
from fastapi.responses import FileResponse
from typing import Optional

router = APIRouter(prefix="/files", tags=["Files"])

def get_file_service() -> FileService:
    return FileService()

@router.get("", response_model=list[FileInfo])
async def list_files(path: str = "", service: FileService = Depends(get_file_service)):
    return await service.list_files(path)

@router.get("/tree")
async def get_tree(path: str = "", service: FileService = Depends(get_file_service)):
    return await service.get_tree(path)

@router.get("/read")
async def read_file(path: str, service: FileService = Depends(get_file_service)):
    content = await service.read_file(path)
    return {"content": content}

@router.post("/write", response_model=FileInfo)
async def write_file(req: FileWriteRequest, service: FileService = Depends(get_file_service)):
    return await service.write_file(req.path, req.content)

@router.post("/upload", response_model=FileInfo)
async def upload_file(
    file: UploadFile = File(...), 
    dest_path: str = Form(""), 
    service: FileService = Depends(get_file_service)
):
    return await service.save_file(file, dest_path)

@router.get("/download")
async def download_file(path: str, service: FileService = Depends(get_file_service)):
    target = service._resolve_path(path)
    return FileResponse(path=target, filename=target.name)

@router.post("/mkdir", response_model=FileInfo)
async def mkdir(req: FileMkdirRequest, service: FileService = Depends(get_file_service)):
    return await service.mkdir(req.path, req.name)

@router.post("/rename", response_model=FileInfo)
async def rename(req: FileRenameRequest, service: FileService = Depends(get_file_service)):
    return await service.rename(req.path, req.new_name)

@router.delete("/delete")
async def delete_file(req: FileDeleteRequest, service: FileService = Depends(get_file_service)):
    await service.delete_file(req.path)
    return {"status": "success"}

@router.post("/move")
async def move_file(req: FileMoveRequest, service: FileService = Depends(get_file_service)):
    await service.move(req.source_path, req.dest_path)
    return {"status": "success"}

@router.post("/copy")
async def copy_file(req: FileCopyRequest, service: FileService = Depends(get_file_service)):
    await service.copy(req.source_path, req.dest_path)
    return {"status": "success"}

@router.post("/compress")
async def compress_files(req: FileCompressRequest, service: FileService = Depends(get_file_service)):
    await service.compress(req.paths, req.dest_path, req.format)
    return {"status": "success"}

@router.post("/extract")
async def extract_files(req: FileExtractRequest, service: FileService = Depends(get_file_service)):
    await service.extract(req.path, req.dest_path)
    return {"status": "success"}
