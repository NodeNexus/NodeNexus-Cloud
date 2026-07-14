from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.memory import Memory

class KnowledgeService:
    @staticmethod
    async def save_memory(db: AsyncSession, key: str, value: str):
        res = await db.execute(select(Memory).filter(Memory.key == key))
        mem = res.scalars().first()
        if mem:
            mem.value = value
        else:
            mem = Memory(key=key, value=value)
            db.add(mem)
        await db.commit()

    @staticmethod
    async def get_memory(db: AsyncSession, key: str) -> str:
        res = await db.execute(select(Memory).filter(Memory.key == key))
        mem = res.scalars().first()
        return mem.value if mem else None

    @staticmethod
    async def get_context(db: AsyncSession) -> str:
        res = await db.execute(select(Memory))
        mems = res.scalars().all()
        return "\n".join([f"{m.key}: {m.value}" for m in mems])
