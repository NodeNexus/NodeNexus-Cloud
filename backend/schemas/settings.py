from pydantic import BaseModel
from typing import Optional

class SystemSettings(BaseModel):
    hostname: str
    ip: Optional[str] = None
    update_channel: str = "stable"
    enable_ssh: bool = False
