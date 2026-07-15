from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.rds_service import rds_service

router = APIRouter(prefix="/rds", tags=["RDS"])

class CreateDatabaseRequest(BaseModel):
    engine: str = "postgres"
    instance_type: str = "t2.micro"

@router.get("/instances")
async def list_databases():
    try:
        return await rds_service.list_databases()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/instances")
async def create_database(req: CreateDatabaseRequest):
    try:
        return await rds_service.create_database(req.engine, req.instance_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/instances/{instance_id}")
async def delete_database(instance_id: str):
    try:
        return await rds_service.delete_database(instance_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
