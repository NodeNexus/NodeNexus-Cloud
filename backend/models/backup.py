from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float
from datetime import datetime, timezone
from database import Base

class BackupSnapshot(Base):
    __tablename__ = "backup_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    filepath = Column(String, nullable=False)
    size_mb = Column(Float, default=0.0)
    targets = Column(String, nullable=False) # JSON list of targets e.g. ["sqlite", "grafana_volumes"]
    is_encrypted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class BackupSchedule(Base):
    __tablename__ = "backup_schedules"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    schedule = Column(String, nullable=False) # Cron
    targets = Column(String, nullable=False) # JSON list
    retention_days = Column(Integer, default=7)
    is_active = Column(Boolean, default=True)
    last_run = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
