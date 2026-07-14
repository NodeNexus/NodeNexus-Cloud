from pydantic import BaseModel
from typing import Optional

class TerminalRequest(BaseModel):
    command: str
    cwd: str = "/"

class TerminalResponse(BaseModel):
    stdout: str
    stderr: str
    exit_code: int

class TerminalCancelRequest(BaseModel):
    session_id: str

class TerminalAutocompleteRequest(BaseModel):
    cwd: str
    partial_command: str
