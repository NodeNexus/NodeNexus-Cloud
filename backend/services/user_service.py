from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.user import User
from models.role import Role
from models.permission import Permission
from schemas.user import UserCreate, UserUpdate

class UserService:
    @staticmethod
    async def get_all_users(db: AsyncSession) -> list[User]:
        result = await db.execute(select(User))
        return result.scalars().unique().all()

    @staticmethod
    async def get_user(db: AsyncSession, user_id: int) -> User:
        result = await db.execute(select(User).filter(User.id == user_id))
        return result.scalars().first()

    @staticmethod
    async def delete_user(db: AsyncSession, user_id: int):
        user = await UserService.get_user(db, user_id)
        if user:
            await db.delete(user)
            await db.commit()

    @staticmethod
    async def get_all_roles(db: AsyncSession) -> list[Role]:
        result = await db.execute(select(Role))
        return result.scalars().unique().all()
