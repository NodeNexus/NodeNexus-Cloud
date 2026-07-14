from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db
from schemas.backup import BackupSnapshotSchema, BackupScheduleSchema, CreateSnapshotRequest
from models.backup import BackupSnapshot, BackupSchedule
from services.backup_service import BackupService
import json

router = APIRouter(prefix="/backups", tags=["Backups"])
backup_service = BackupService()

@router.get("/snapshots", response_model=list[BackupSnapshotSchema])
async def list_snapshots(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(BackupSnapshot).order_by(BackupSnapshot.created_at.desc()))
    return res.scalars().all()

@router.post("/snapshots")
async def create_snapshot(req: CreateSnapshotRequest, db: AsyncSession = Depends(get_db)):
    try:
        result = backup_service.create_snapshot(
            name=req.name, 
            description=req.description, 
            targets=req.targets, 
            encrypt=req.encrypt
        )
        
        snapshot = BackupSnapshot(
            name=result["name"],
            description=result["description"],
            filepath=result["filepath"],
            size_mb=result["size_mb"],
            targets=result["targets"],
            is_encrypted=result["is_encrypted"]
        )
        db.add(snapshot)
        await db.commit()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{snapshot_id}/restore")
async def restore_snapshot(snapshot_id: int, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(BackupSnapshot).where(BackupSnapshot.id == snapshot_id))
    snapshot = res.scalar_one_or_none()
    if not snapshot:
        raise HTTPException(status_code=404, detail="Snapshot not found")
        
    try:
        backup_service.restore_snapshot(snapshot.filepath)
        return {"status": "success", "message": f"Restored {snapshot.name}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/schedules", response_model=list[BackupScheduleSchema])
async def list_schedules(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(BackupSchedule))
    return res.scalars().all()

@router.post("/schedules")
async def create_schedule(schedule: BackupScheduleSchema, db: AsyncSession = Depends(get_db)):
    new_sched = BackupSchedule(
        name=schedule.name,
        schedule=schedule.schedule,
        targets=schedule.targets,
        retention_days=schedule.retention_days,
        is_active=schedule.is_active
    )
    db.add(new_sched)
    await db.commit()
    return {"status": "success"}
