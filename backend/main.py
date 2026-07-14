from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from config import get_settings
from utils.logger import get_logger

from routers import (
    system,
    docker,
    files,
    terminal,
    marketplace,
    settings,
    monitoring,
    auth,
    users,
    roles
)

settings_conf = get_settings()
logger = get_logger(__name__)

async def lifespan(app: FastAPI):
    logger.info("Starting up VNAV Cloud Backend...")
    # Initialize the database
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    logger.info("Shutting down VNAV Cloud Backend...")
    await engine.dispose()

app = FastAPI(
    title=settings_conf.app_name,
    debug=settings_conf.debug,
    lifespan=lifespan
)

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(system.router)
app.include_router(docker.router)
app.include_router(files.router)
app.include_router(terminal.router)
app.include_router(marketplace.router)
app.include_router(settings.router)
app.include_router(monitoring.router)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(roles.router)

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy"}
