from fastapi import APIRouter
from schemas.kubernetes import HelmChart
from typing import List

router = APIRouter(prefix="/helm", tags=["Helm"])

@router.get("/charts", response_model=List[HelmChart])
async def list_charts():
    # Stubbed Helm Charts
    return [
        HelmChart(name="nginx", repo="bitnami", version="15.0.0", description="NGINX server"),
        HelmChart(name="redis", repo="bitnami", version="18.0.0", description="Redis datastore"),
    ]

@router.post("/install")
async def install_chart(name: str):
    return {"status": "success", "message": f"Installed {name}"}
