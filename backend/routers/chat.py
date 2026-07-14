from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from schemas.chat import ChatRequest, ConversationResponse
from services.agent_service import AgentService
from models.conversation import Conversation, Message
from routers.auth import get_current_user
from models.user import User

router = APIRouter(prefix="/ai", tags=["AI Chat"])

@router.post("/chat/stream")
async def chat_stream(req: ChatRequest, db: AsyncSession = Depends(get_db)):
    # Prepare messages dict
    messages = [{"role": m.role, "content": m.content} for m in req.messages]
    
    # We use StreamingResponse to stream back the chunks
    return StreamingResponse(
        AgentService.process_chat(messages, req.model),
        media_type="text/event-stream"
    )

@router.get("/history", response_model=list[ConversationResponse])
async def get_history(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return []

@router.delete("/history")
async def delete_history(id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return {"status": "deleted"}
