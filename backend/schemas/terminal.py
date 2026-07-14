from pydantic import BaseModel

class TerminalRequest(BaseModel):
    command: str
    cwd: str = "/"

class TerminalResponse(BaseModel):
    stdout: str
    stderr: str
    exit_code: int
