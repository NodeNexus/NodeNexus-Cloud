from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.s3_service import s3_service

router = APIRouter(prefix="/s3", tags=["S3"])

class CreateBucketRequest(BaseModel):
    name: str

@router.get("/buckets")
async def list_buckets():
    try:
        return await s3_service.list_buckets()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/buckets")
async def create_bucket(req: CreateBucketRequest):
    try:
        return await s3_service.create_bucket(req.name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/buckets/{bucket_name}")
async def delete_bucket(bucket_name: str):
    try:
        return await s3_service.delete_bucket(bucket_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
