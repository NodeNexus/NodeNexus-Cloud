from fastapi import APIRouter, Depends
from services.kubernetes_service import k8s_client
from schemas.kubernetes import PodStatus
from typing import List

router = APIRouter(prefix="/pods", tags=["Pods"])

@router.get("", response_model=List[PodStatus])
async def list_pods(namespace: str = "default"):
    return k8s_client.get_pods(namespace)

@router.post("/restart")
async def restart_pod(name: str, namespace: str = "default"):
    success = k8s_client.restart_pod(name, namespace)
    if success:
        return {"status": "success"}
    return {"status": "error", "message": "Failed to restart pod"}
