from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.lambda_service import lambda_service

router = APIRouter(prefix="/lambda", tags=["Lambda"])

class InvokeRequest(BaseModel):
    code: str
    runtime: str = "python:3.11-alpine"

@router.post("/invoke")
async def invoke_function(req: InvokeRequest):
    try:
        return await lambda_service.invoke_function(req.code, req.runtime)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
