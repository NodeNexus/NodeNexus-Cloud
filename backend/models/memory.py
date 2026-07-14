from sqlalchemy import Column, Integer, String, DateTime, Text, Float
from datetime import datetime, timezone
from database import Base

class Memory(Base):
    __tablename__ = "ai_memories"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True, nullable=False)
    value = Column(Text, nullable=False) # Context string or JSON
    importance = Column(Float, default=1.0)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
