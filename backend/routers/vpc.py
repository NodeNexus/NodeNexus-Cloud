from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.vpc_service import vpc_service

router = APIRouter(prefix="/vpc", tags=["VPC"])

class CreateNetworkRequest(BaseModel):
    name: str
    driver: str = "bridge"

@router.get("/networks")
async def list_networks():
    try:
        return await vpc_service.list_networks()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/networks")
async def create_network(req: CreateNetworkRequest):
    try:
        return await vpc_service.create_network(req.name, req.driver)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/networks/{network_id}")
async def delete_network(network_id: str):
    try:
        return await vpc_service.delete_network(network_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
