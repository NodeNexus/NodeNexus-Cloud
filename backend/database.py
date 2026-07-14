from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from config import get_settings

settings = get_settings()

engine = create_async_engine(
    settings.database_url,
    echo=settings.debug,
    connect_args={"check_same_thread": False} # Needed for SQLite
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
