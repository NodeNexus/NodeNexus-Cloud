from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from schemas.automation import AutomationWorkflowSchema

router = APIRouter(prefix="/ai/automation", tags=["AI Automation"])

@router.get("", response_model=list[AutomationWorkflowSchema])
async def list_workflows(db: AsyncSession = Depends(get_db)):
    return []

@router.post("")
async def create_workflow(req: AutomationWorkflowSchema, db: AsyncSession = Depends(get_db)):
    return req
