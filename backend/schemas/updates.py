from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UpdateHistorySchema(BaseModel):
    id: Optional[int] = None
    component_type: str
    component_name: str
    previous_version: Optional[str] = None
    new_version: str
    status: str
    logs: Optional[str] = None
    timestamp: Optional[datetime] = None

    class Config:
        from_attributes = True

class SystemStateSchema(BaseModel):
    maintenance_mode: bool
    restart_required: bool

    class Config:
        from_attributes = True

class AvailableUpdateSchema(BaseModel):
    component_type: str
    component_name: str
    current_version: str
    available_version: str
    changelog: Optional[str] = None
    is_critical: bool = False
