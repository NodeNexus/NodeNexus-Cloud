from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.container_service import container_service

router = APIRouter(prefix="/containers", tags=["Containers"])

class DeployRequest(BaseModel):
    name: str
    image: str
    cluster: str = "default"

@router.get("/services")
async def list_services():
    try:
        return await container_service.list_services()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/services")
async def deploy_service(req: DeployRequest):
    try:
        return await container_service.deploy_service(req.name, req.image, req.cluster)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/services/{service_id}")
async def stop_service(service_id: str):
    try:
        return await container_service.stop_service(service_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
