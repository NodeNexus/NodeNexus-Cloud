from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from models.cluster import Cluster
from schemas.kubernetes import ClusterCreateRequest, ResourceStatus
from routers.auth import get_current_user

router = APIRouter(prefix="/cluster", tags=["Cluster"])

@router.get("")
async def get_clusters(db: AsyncSession = Depends(get_db)):
    # Returns clusters from DB (stubbed)
    return []

@router.post("/create")
async def create_cluster(req: ClusterCreateRequest, db: AsyncSession = Depends(get_db)):
    # Simulates cluster creation
    return {"status": "creating", "name": req.name, "type": req.cluster_type}

@router.get("/status")
async def get_status():
    return {"status": "online", "version": "v1.27.3"}

@router.get("/resources", response_model=ResourceStatus)
async def get_resources():
    return ResourceStatus(cpu="45%", memory="60%", storage="30%")

@router.get("/health")
async def get_health():
    return {"status": "healthy"}
