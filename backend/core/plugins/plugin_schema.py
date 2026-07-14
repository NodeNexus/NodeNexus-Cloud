from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class PluginManifest(BaseModel):
    id: str
    name: str
    description: str
    version: str
    author: str
    category: str
    icon: Optional[str] = None
    docker_image: Optional[str] = None
    compose_file: Optional[str] = None
    ports: Optional[Dict[str, str]] = None
    volumes: Optional[Dict[str, str]] = None
    environment: Optional[Dict[str, str]] = None
    healthcheck: Optional[Dict[str, Any]] = None
    website: Optional[str] = None
    documentation: Optional[str] = None
    license: Optional[str] = None
    requirements: Optional[List[str]] = None
    minimum_version: Optional[str] = None

class PluginStatusResponse(BaseModel):
    manifest: PluginManifest
    installed: bool
    status: str
