from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.rds_service import rds_service

router = APIRouter(prefix="/dynamodb", tags=["DynamoDB"])

class CreateTableRequest(BaseModel):
    name: str
    engine: str = "mongo" # mongo or redis for nosql
    instance_type: str = "t2.micro"

@router.post("/tables")
async def create_table(req: CreateTableRequest):
    try:
        image = "mongo:latest" if req.engine == "mongo" else "redis:alpine"
        return await rds_service.create_database(engine=req.engine, instance_type=req.instance_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
