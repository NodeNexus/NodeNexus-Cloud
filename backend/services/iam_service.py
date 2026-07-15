from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.user import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

async def get_user_by_email(db: AsyncSession, email: str):
    result = await db.execute(select(User).filter(User.email == email))
    return result.scalars().first()

async def create_user(db: AsyncSession, email: str, password: str, role: str = "user"):
    hashed_password = get_password_hash(password)
    db_user = User(email=email, hashed_password=hashed_password, role=role)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user
