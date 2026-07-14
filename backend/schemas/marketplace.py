from pydantic import BaseModel
from typing import Optional

class AppInstallRequest(BaseModel):
    app_name: str
    port_mapping: Optional[str] = None
    env_vars: Optional[dict] = None

class AppInfo(BaseModel):
    name: str
    description: str
    image: str
    category: str
