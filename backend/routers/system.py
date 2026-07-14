from fastapi import APIRouter
from schemas.system import SystemStats
from services.system_service import SystemService

router = APIRouter(prefix="/system", tags=["System"])

@router.get("", response_model=SystemStats)
async def get_system_info():
    return await SystemService.get_system_stats()
