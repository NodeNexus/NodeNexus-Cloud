from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class MessageSchema(BaseModel):
    role: str
    content: str
    tool_calls: Optional[List[Dict[str, Any]]] = None

class ChatRequest(BaseModel):
    conversation_id: Optional[int] = None
    messages: List[MessageSchema]
    model: str = "llama3.2"
    stream: bool = True

class ConversationResponse(BaseModel):
    id: int
    title: str
    is_pinned: bool
    created_at: datetime
    messages: List[MessageSchema] = []

    class Config:
        from_attributes = True
