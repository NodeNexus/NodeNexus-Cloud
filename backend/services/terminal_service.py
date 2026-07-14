import asyncio
import uuid
import sys
from fastapi import WebSocket
from schemas.terminal import TerminalResponse

class TerminalSession:
    def __init__(self, websocket: WebSocket, cwd: str = "/"):
        self.websocket = websocket
        self.cwd = cwd
        self.process = None
        self.id = str(uuid.uuid4())
        
    async def start(self):
        # On Windows, default to cmd or powershell. We'll use powershell for better experience.
        shell_cmd = "powershell.exe" if sys.platform == "win32" else "bash"
        
        self.process = await asyncio.create_subprocess_exec(
            shell_cmd,
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=self.cwd
        )
        
        # Start reading stdout and stderr
        asyncio.create_task(self._read_stream(self.process.stdout, "stdout"))
        asyncio.create_task(self._read_stream(self.process.stderr, "stderr"))

    async def _read_stream(self, stream, stream_type):
        try:
            while True:
                data = await stream.read(1024)
                if not data:
                    break
                await self.websocket.send_text(data.decode("utf-8", errors="replace"))
        except Exception:
            pass
            
    async def write(self, data: str):
        if self.process and self.process.stdin:
            self.process.stdin.write(data.encode("utf-8"))
            await self.process.stdin.drain()

    async def close(self):
        if self.process:
            try:
                self.process.terminate()
            except ProcessLookupError:
                pass


class TerminalService:
    _sessions = {}

    @classmethod
    async def create_session(cls, websocket: WebSocket, cwd: str = "/") -> TerminalSession:
        session = TerminalSession(websocket, cwd)
        await session.start()
        cls._sessions[session.id] = session
        return session
        
    @classmethod
    async def get_session(cls, session_id: str) -> TerminalSession:
        return cls._sessions.get(session_id)
        
    @classmethod
    async def remove_session(cls, session_id: str):
        if session_id in cls._sessions:
            await cls._sessions[session_id].close()
            del cls._sessions[session_id]

    @staticmethod
    async def run_command(command: str, cwd: str = "/") -> TerminalResponse:
        process = await asyncio.create_subprocess_shell(
            command,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=cwd
        )
        stdout, stderr = await process.communicate()
        
        return TerminalResponse(
            stdout=stdout.decode('utf-8') if stdout else "",
            stderr=stderr.decode('utf-8') if stderr else "",
            exit_code=process.returncode or 0
        )
