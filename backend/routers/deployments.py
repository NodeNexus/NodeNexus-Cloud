from fastapi import APIRouter
from services.kubernetes_service import k8s_client
from schemas.kubernetes import DeploymentStatus
from typing import List

router = APIRouter(prefix="/deployments", tags=["Deployments"])

@router.get("", response_model=List[DeploymentStatus])
async def list_deployments(namespace: str = "default"):
    return k8s_client.get_deployments(namespace)
