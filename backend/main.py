from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import ec2, vpc, ebs, iam, s3, rds, dynamodb, lambda_router, system
from core.database import engine, Base
import asyncio

app = FastAPI(title="VNAV Cloud API", version="2.0.0", lifespan=None)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ec2.router)
app.include_router(vpc.router)
app.include_router(ebs.router)
app.include_router(iam.router)
app.include_router(s3.router)
app.include_router(rds.router)
app.include_router(dynamodb.router)
app.include_router(lambda_router.router)
app.include_router(system.router)

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "VNAV Cloud backend is running."}
