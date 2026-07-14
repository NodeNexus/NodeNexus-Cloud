from fastapi import APIRouter, UploadFile, File, Depends
from schemas.files import FileInfo, FileDeleteRequest
from services.file_service import FileService

router = APIRouter(prefix="/files", tags=["Files"])

def get_file_service() -> FileService:
    return FileService()

@router.get("/list", response_model=list[FileInfo])
async def list_files(service: FileService = Depends(get_file_service)):
    return await service.list_files()

@router.post("/upload", response_model=FileInfo)
async def upload_file(file: UploadFile = File(...), service: FileService = Depends(get_file_service)):
    return await service.save_file(file)

@router.delete("/delete")
async def delete_file(req: FileDeleteRequest, service: FileService = Depends(get_file_service)):
    await service.delete_file(req.path)
    return {"status": "success", "message": "File deleted."}
