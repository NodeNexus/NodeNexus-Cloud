from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class ModelInfo(BaseModel):
    name: str
    size: str
    modified_at: str

class PullModelRequest(BaseModel):
    name: str

class ToolCall(BaseModel):
    name: str
    arguments: Dict[str, Any]

class ToolExecutionRequest(BaseModel):
    tool_name: str
    arguments: Dict[str, Any]
