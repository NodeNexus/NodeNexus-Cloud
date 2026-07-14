from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.models import SettingsModel
from schemas.settings import SystemSettings

class SettingsService:
    @staticmethod
    async def get_settings(db: AsyncSession) -> SystemSettings:
        result = await db.execute(select(SettingsModel).limit(1))
        settings_record = result.scalars().first()
        
        if not settings_record:
            settings_record = SettingsModel()
            db.add(settings_record)
            await db.commit()
            await db.refresh(settings_record)
            
        return SystemSettings(
            hostname=settings_record.hostname,
            update_channel=settings_record.update_channel,
            enable_ssh=settings_record.enable_ssh
        )

    @staticmethod
    async def update_settings(db: AsyncSession, settings: SystemSettings) -> SystemSettings:
        result = await db.execute(select(SettingsModel).limit(1))
        settings_record = result.scalars().first()
        
        if not settings_record:
            settings_record = SettingsModel()
            db.add(settings_record)
            
        settings_record.hostname = settings.hostname
        settings_record.update_channel = settings.update_channel
        settings_record.enable_ssh = settings.enable_ssh
        
        await db.commit()
        await db.refresh(settings_record)
        
        return settings
