from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from routers import ec2, vpc, ebs, iam, s3, rds, dynamodb, lambda_router, system, containers, terminal, gateway, files
from core.database import engine, Base
from core.security import CORS_ORIGINS
import asyncio

app = FastAPI(title="NodeNexus Cloud API", version="2.1.0", lifespan=None)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# P1: Restrict CORS to configured origins (not wildcard *)
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Requested-With"],
)

# P0: Add security headers to every response
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response: Response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "connect-src * 'unsafe-inline'; "
        "script-src 'self' 'unsafe-inline'; "
        "style-src 'self' 'unsafe-inline';"
    )
    return response

app.include_router(ec2.router)
app.include_router(vpc.router)
app.include_router(ebs.router)
app.include_router(iam.router)
app.include_router(s3.router)
app.include_router(rds.router)
app.include_router(dynamodb.router)
app.include_router(lambda_router.router)
app.include_router(containers.router)
app.include_router(gateway.router)
app.include_router(files.router)
app.include_router(system.router)
app.include_router(terminal.router)

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "NodeNexus Cloud backend is running."}
