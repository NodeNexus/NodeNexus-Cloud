from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from models.role import Role
from routers.auth import get_current_user
from models.user import User

router = APIRouter(prefix="/roles", tags=["Roles"])

@router.get("")
async def list_roles(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return []

@router.post("")
async def create_role():
    return {"status": "not_implemented"}
