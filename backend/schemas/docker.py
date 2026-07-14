from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ContainerInfo(BaseModel):
    id: str
    name: str
    image: str
    status: str
    ports: Dict[str, Any]
    created: str

class ImageInfo(BaseModel):
    id: str
    tags: List[str]
    size: int
    created: str

class DockerActionResponse(BaseModel):
    status: str
    message: str
    container_id: str
