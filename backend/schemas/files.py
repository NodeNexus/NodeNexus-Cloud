from pydantic import BaseModel

class FileInfo(BaseModel):
    name: str
    path: str
    is_dir: bool
    size: int
    modified: float

class FileDeleteRequest(BaseModel):
    path: str
