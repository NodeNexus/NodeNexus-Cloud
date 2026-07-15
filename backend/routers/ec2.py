from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ec2_service import ec2_service

router = APIRouter(prefix="/ec2", tags=["EC2"])

class RunInstanceRequest(BaseModel):
    image: str
    instance_type: str = "t2.micro"

@router.get("/instances")
async def list_instances():
    try:
        return await ec2_service.list_instances()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/instances")
async def run_instance(req: RunInstanceRequest):
    try:
        return await ec2_service.run_instance(req.image, req.instance_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/instances/{instance_id}")
async def terminate_instance(instance_id: str):
    try:
        return await ec2_service.terminate_instance(instance_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
