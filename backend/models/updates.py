from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from datetime import datetime, timezone
from database import Base

class UpdateHistory(Base):
    __tablename__ = "update_history"

    id = Column(Integer, primary_key=True, index=True)
    component_type = Column(String, nullable=False) # docker, os, plugin, k8s, ollama
    component_name = Column(String, nullable=False)
    previous_version = Column(String, nullable=True)
    new_version = Column(String, nullable=False)
    status = Column(String, default="success") # success, failed, rollback
    logs = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class SystemState(Base):
    __tablename__ = "system_state"

    id = Column(Integer, primary_key=True, index=True)
    maintenance_mode = Column(Boolean, default=False)
    restart_required = Column(Boolean, default=False)
