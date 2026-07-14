from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.settings import SystemSettings
from services.settings_service import SettingsService
from database import get_db

router = APIRouter(prefix="/settings", tags=["Settings"])

@router.get("", response_model=SystemSettings)
async def get_settings(db: AsyncSession = Depends(get_db)):
    return await SettingsService.get_settings(db)

@router.post("", response_model=SystemSettings)
async def update_settings(settings: SystemSettings, db: AsyncSession = Depends(get_db)):
    return await SettingsService.update_settings(db, settings)
