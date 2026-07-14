from fastapi import APIRouter
from services.ollama_service import OllamaService
from schemas.ai import ModelInfo, PullModelRequest
from typing import List

router = APIRouter(prefix="/ai", tags=["AI Core"])

@router.get("/models", response_model=List[ModelInfo])
async def list_models():
    return OllamaService.get_models()

@router.post("/model/pull")
async def pull_model(req: PullModelRequest):
    success = OllamaService.pull_model(req.name)
    return {"status": "success" if success else "error"}

@router.delete("/model/delete")
async def delete_model(name: str):
    success = OllamaService.delete_model(name)
    return {"status": "success" if success else "error"}
