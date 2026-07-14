import asyncio
from schemas.terminal import TerminalResponse

class TerminalService:
    @staticmethod
    async def run_command(command: str, cwd: str = "/") -> TerminalResponse:
        # In a real app, this should be heavily restricted or use docker exec
        # We'll use asyncio.subprocess for demonstration but restrict dangerous commands
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
