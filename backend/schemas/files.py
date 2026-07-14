from pydantic import BaseModel

class FileInfo(BaseModel):
    name: str
    path: str
    is_dir: bool
    size: int
    modified: float

class FileDeleteRequest(BaseModel):
    path: str

class FileRenameRequest(BaseModel):
    path: str
    new_name: str

class FileMoveRequest(BaseModel):
    source_path: str
    dest_path: str

class FileCopyRequest(BaseModel):
    source_path: str
    dest_path: str

class FileMkdirRequest(BaseModel):
    path: str
    name: str

class FileWriteRequest(BaseModel):
    path: str
    content: str

class FileCompressRequest(BaseModel):
    paths: list[str]
    dest_path: str
    format: str = "zip"

class FileExtractRequest(BaseModel):
    path: str
    dest_path: str
