from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    app_name: str = "VNAV Cloud API"
    debug: bool = True
    database_url: str = "sqlite+aiosqlite:///./vnav.db"
    log_level: str = "INFO"

    model_config = SettingsConfigDict(env_file=".env")

@lru_cache()
def get_settings():
    return Settings()
