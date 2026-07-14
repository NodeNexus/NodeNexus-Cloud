from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db
from schemas.updates import UpdateHistorySchema, SystemStateSchema, AvailableUpdateSchema
from models.updates import UpdateHistory, SystemState
from services.update_service import UpdateService
from pydantic import BaseModel

router = APIRouter(prefix="/updates", tags=["Updates"])

class ApplyUpdateRequest(BaseModel):
    component_type: str
    component_name: str
    current_version: str
    new_version: str

@router.get("/check", response_model=list[AvailableUpdateSchema])
async def check_updates():
    return await UpdateService.check_for_updates()

@router.post("/apply")
async def apply_update(req: ApplyUpdateRequest, db: AsyncSession = Depends(get_db)):
    try:
        result = await UpdateService.apply_update(req.component_type, req.component_name, req.new_version)
        
        history = UpdateHistory(
            component_type=req.component_type,
            component_name=req.component_name,
            previous_version=req.current_version,
            new_version=req.new_version,
            status=result["status"],
            logs=result["message"]
        )
        db.add(history)
        
        # Update system state if restart required
        if result.get("requires_restart"):
            state_res = await db.execute(select(SystemState).limit(1))
            state = state_res.scalar_one_or_none()
            if not state:
                state = SystemState(restart_required=True)
                db.add(state)
            else:
                state.restart_required = True
                
        await db.commit()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history", response_model=list[UpdateHistorySchema])
async def get_history(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(UpdateHistory).order_by(UpdateHistory.timestamp.desc()))
    return res.scalars().all()

@router.get("/state", response_model=SystemStateSchema)
async def get_state(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(SystemState).limit(1))
    state = res.scalar_one_or_none()
    if not state:
        state = SystemState()
        db.add(state)
        await db.commit()
    return state

@router.post("/maintenance")
async def toggle_maintenance(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(SystemState).limit(1))
    state = res.scalar_one_or_none()
    if not state:
        state = SystemState(maintenance_mode=True)
        db.add(state)
    else:
        state.maintenance_mode = not state.maintenance_mode
    await db.commit()
    return {"maintenance_mode": state.maintenance_mode}
