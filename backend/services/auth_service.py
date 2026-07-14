from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from passlib.context import CryptContext
from models.user import User
from schemas.auth import RegisterRequest
from datetime import datetime, timezone

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    async def get_user_by_email(db: AsyncSession, email: str) -> User:
        result = await db.execute(select(User).filter(User.email == email))
        return result.scalars().first()

    @staticmethod
    async def create_user(db: AsyncSession, req: RegisterRequest) -> User:
        hashed_password = AuthService.get_password_hash(req.password)
        db_user = User(
            email=req.email,
            username=req.username,
            full_name=req.full_name,
            hashed_password=hashed_password
        )
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        return db_user

    @staticmethod
    async def update_last_login(db: AsyncSession, user: User):
        user.last_login = datetime.now(timezone.utc)
        await db.commit()
