from fastapi import APIRouter
from schemas.terminal import TerminalRequest, TerminalResponse
from services.terminal_service import TerminalService

router = APIRouter(prefix="/terminal", tags=["Terminal"])

@router.post("/command", response_model=TerminalResponse)
async def run_command(req: TerminalRequest):
    return await TerminalService.run_command(req.command, req.cwd)
