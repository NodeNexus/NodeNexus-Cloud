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
        return await rds_service.create_database(engine=req.engine, instance_type=req.instance_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tables")
async def get_tables():
    from services.ec2_service import ec2_service
    instances = await ec2_service.list_instances()
    return [i for i in instances if any(db in i["image"] for db in ["mongo", "redis"])]

@router.delete("/tables/{table_id}")
async def delete_table(table_id: str):
    return await rds_service.delete_database(table_id)
