from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from schemas.terminal import TerminalRequest, TerminalResponse, TerminalCancelRequest, TerminalAutocompleteRequest
from services.terminal_service import TerminalService

router = APIRouter(prefix="/terminal", tags=["Terminal"])

@router.post("/execute", response_model=TerminalResponse)
async def execute(req: TerminalRequest):
    return await TerminalService.run_command(req.command, req.cwd)

@router.websocket("/ws")
async def terminal_websocket(websocket: WebSocket, cwd: str = "/"):
    await websocket.accept()
    session = await TerminalService.create_session(websocket, cwd)
    try:
        while True:
            data = await websocket.receive_text()
            await session.write(data)
    except WebSocketDisconnect:
        await TerminalService.remove_session(session.id)
    except Exception as e:
        await TerminalService.remove_session(session.id)

@router.get("/history")
async def get_history():
    return {"history": []}

@router.delete("/history")
async def delete_history():
    return {"status": "success"}

@router.post("/cancel")
async def cancel_process(req: TerminalCancelRequest):
    await TerminalService.remove_session(req.session_id)
    return {"status": "success"}

@router.post("/autocomplete")
async def autocomplete(req: TerminalAutocompleteRequest):
    return {"suggestions": []}
