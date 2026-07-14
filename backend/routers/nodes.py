from fastapi import APIRouter, Depends
from services.kubernetes_service import k8s_client
from schemas.kubernetes import NodeStatus
from typing import List

router = APIRouter(prefix="/nodes", tags=["Nodes"])

@router.get("", response_model=List[NodeStatus])
async def list_nodes():
    return k8s_client.get_nodes()
