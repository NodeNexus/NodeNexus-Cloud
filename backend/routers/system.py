from fastapi import APIRouter
from services.system_service import SystemService

router = APIRouter(prefix="/api/system", tags=["System"])
system_service = SystemService()

@router.get("/dashboard")
async def get_dashboard():
    """Returns live hardware and orchestration metrics for the frontend Dashboard."""
    return system_service.get_dashboard_metrics()
