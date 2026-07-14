from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.system_service import SystemService
from utils.logger import get_logger
import asyncio

logger = get_logger(__name__)
router = APIRouter(prefix="/monitoring", tags=["Monitoring"])

@router.get("/status")
async def monitoring_status():
    return {"status": "Monitoring service is active with WebSocket streaming."}

@router.websocket("/ws/realtime")
async def websocket_realtime_endpoint(websocket: WebSocket):
    await websocket.accept()
    logger.info("Client connected to real-time WebSocket.")
    try:
        while True:
            # Fetch latest stats
            stats = await SystemService.get_system_stats()
            # Send stats as JSON
            await websocket.send_json(stats.model_dump())
            # Wait for 1 second before next update
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        logger.info("Client disconnected from real-time WebSocket.")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
