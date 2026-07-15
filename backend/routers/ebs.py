from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ebs_service import ebs_service

router = APIRouter(prefix="/ebs", tags=["EBS"])

class CreateVolumeRequest(BaseModel):
    name: str

@router.get("/volumes")
async def list_volumes():
    try:
        return await ebs_service.list_volumes()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/volumes")
async def create_volume(req: CreateVolumeRequest):
    try:
        return await ebs_service.create_volume(req.name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/volumes/{name}")
async def delete_volume(name: str):
    try:
        return await ebs_service.delete_volume(name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
