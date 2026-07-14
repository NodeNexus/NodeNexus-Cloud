from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ContainerInfo(BaseModel):
    id: str
    name: str
    image: str
    status: str
    ports: Dict[str, Any]
    created: str

class ContainerDetails(ContainerInfo):
    stats: Optional[Dict[str, Any]] = None
    env: Optional[List[str]] = None
    cmd: Optional[List[str]] = None

class ImageInfo(BaseModel):
    id: str
    tags: List[str]
    size: int
    created: str

class DockerActionResponse(BaseModel):
    status: str
    message: str
    container_id: Optional[str] = None

class CreateContainerRequest(BaseModel):
    image: str
    name: Optional[str] = None
    ports: Optional[Dict[str, str]] = None
    env: Optional[List[str]] = None
    command: Optional[str] = None

class PullImageRequest(BaseModel):
    image: str

class DockerPruneResponse(BaseModel):
    containers_deleted: Optional[List[str]] = None
    images_deleted: Optional[List[str]] = None
    space_reclaimed: int

