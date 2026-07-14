from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from services.knowledge_service import KnowledgeService

router = APIRouter(prefix="/ai/knowledge", tags=["AI Knowledge"])

@router.get("")
async def get_knowledge(db: AsyncSession = Depends(get_db)):
    context = await KnowledgeService.get_context(db)
    return {"context": context}

@router.post("")
async def add_knowledge(key: str, value: str, db: AsyncSession = Depends(get_db)):
    await KnowledgeService.save_memory(db, key, value)
    return {"status": "success"}
