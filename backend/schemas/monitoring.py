from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class AlertRuleSchema(BaseModel):
    id: Optional[int] = None
    name: str
    metric: str
    condition: str
    threshold: float
    is_active: bool = True

    class Config:
        from_attributes = True

class AlertSchema(BaseModel):
    id: Optional[int] = None
    rule_id: Optional[int] = None
    message: str
    severity: str
    is_resolved: bool
    timestamp: Optional[datetime] = None

    class Config:
        from_attributes = True

class NotificationChannelSchema(BaseModel):
    id: Optional[int] = None
    type: str
    name: str
    webhook_url: Optional[str] = None
    config: Optional[str] = None
    is_active: bool = True

    class Config:
        from_attributes = True

class SystemMetrics(BaseModel):
    cpu: float
    memory: float
    storage: float
    network_rx: float
    network_tx: float
