from pydantic import BaseModel
from typing import List, Optional

class DockerSimpleStat(BaseModel):
    name: str
    status: str

class SystemStats(BaseModel):
    hostname: str
    ip: str
    cpu: float
    ram_used: float
    ram_total: float
    disk_used: float
    disk_total: float
    temperature: float
    net_rx: float
    net_tx: float
    uptime: int
    docker_containers: int
    docker_images: int
    containers_status: List[DockerSimpleStat] = []
