from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class NodeStatus(BaseModel):
    name: str
    status: str
    cpu_usage: Optional[str] = None
    memory_usage: Optional[str] = None
    os: Optional[str] = None
    architecture: Optional[str] = None
    ip: Optional[str] = None

class PodStatus(BaseModel):
    name: str
    namespace: str
    node_name: str
    status: str
    restarts: int
    created_at: Optional[datetime] = None
    labels: Dict[str, str] = {}

class DeploymentStatus(BaseModel):
    name: str
    namespace: str
    replicas: int
    available_replicas: int
    ready_replicas: int
    created_at: Optional[datetime] = None

class HelmChart(BaseModel):
    name: str
    repo: str
    version: str
    description: Optional[str] = None

class ClusterCreateRequest(BaseModel):
    name: str
    cluster_type: str = "kubernetes"

class NodeJoinRequest(BaseModel):
    cluster_id: int
    hostname: str
    ip_address: str
    join_token: str

class ResourceStatus(BaseModel):
    cpu: str
    memory: str
    storage: str
