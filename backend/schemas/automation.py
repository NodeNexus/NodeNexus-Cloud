from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AutomationWorkflowSchema(BaseModel):
    id: Optional[int] = None
    name: str
    description: Optional[str] = None
    schedule: str
    trigger_type: str = "cron"
    action_prompt: str
    is_active: bool = True
    last_run: Optional[datetime] = None

    class Config:
        from_attributes = True
