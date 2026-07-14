from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class BackupSnapshotSchema(BaseModel):
    id: Optional[int] = None
    name: str
    description: Optional[str] = None
    filepath: str
    size_mb: float = 0.0
    targets: str
    is_encrypted: bool = False
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class BackupScheduleSchema(BaseModel):
    id: Optional[int] = None
    name: str
    schedule: str
    targets: str
    retention_days: int = 7
    is_active: bool = True
    last_run: Optional[datetime] = None

    class Config:
        from_attributes = True

class CreateSnapshotRequest(BaseModel):
    name: str
    description: Optional[str] = None
    targets: List[str]
    encrypt: bool = False
