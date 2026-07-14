from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db
from schemas.monitoring import SystemMetrics, AlertRuleSchema, AlertSchema, NotificationChannelSchema
from models.monitoring import AlertRule, Alert, NotificationChannel
from services.monitoring_service import MonitoringService

router = APIRouter(prefix="/monitoring", tags=["Monitoring"])

@router.get("/metrics", response_model=SystemMetrics)
async def get_metrics():
    return MonitoringService.get_system_metrics()

@router.get("/rules", response_model=list[AlertRuleSchema])
async def list_rules(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(AlertRule))
    return res.scalars().all()

@router.post("/rules")
async def create_rule(rule: AlertRuleSchema, db: AsyncSession = Depends(get_db)):
    new_rule = AlertRule(
        name=rule.name,
        metric=rule.metric,
        condition=rule.condition,
        threshold=rule.threshold,
        is_active=rule.is_active
    )
    db.add(new_rule)
    await db.commit()
    return {"status": "success"}

@router.get("/alerts", response_model=list[AlertSchema])
async def list_alerts(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Alert))
    return res.scalars().all()

@router.get("/channels", response_model=list[NotificationChannelSchema])
async def list_channels(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(NotificationChannel))
    return res.scalars().all()

@router.post("/channels")
async def create_channel(channel: NotificationChannelSchema, db: AsyncSession = Depends(get_db)):
    new_channel = NotificationChannel(
        type=channel.type,
        name=channel.name,
        webhook_url=channel.webhook_url,
        config=channel.config,
        is_active=channel.is_active
    )
    db.add(new_channel)
    await db.commit()
    return {"status": "success"}
