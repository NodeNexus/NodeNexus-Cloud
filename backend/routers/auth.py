from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordBearer
from database import get_db
from schemas.auth import LoginRequest, RegisterRequest, AuthResponse, Token
from schemas.user import UserResponse
from services.auth_service import AuthService
from services.jwt_service import JWTService
from models.user import User

router = APIRouter(prefix="/auth", tags=["Auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> User:
    payload = JWTService.decode_token(token)
    if not payload or "email" not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = await AuthService.get_user_by_email(db, payload["email"])
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Inactive user")
    return user

@router.post("/register", response_model=AuthResponse)
async def register(req: RegisterRequest, db: AsyncSession = Depends(get_db)):
    existing = await AuthService.get_user_by_email(db, req.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = await AuthService.create_user(db, req)
    
    access_token = JWTService.create_access_token({"email": user.email, "role": user.role_id})
    refresh_token = JWTService.create_refresh_token({"email": user.email})
    
    return AuthResponse(
        user=user,
        token=Token(access_token=access_token, refresh_token=refresh_token)
    )

@router.post("/login", response_model=AuthResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    user = await AuthService.get_user_by_email(db, req.email)
    if not user or not AuthService.verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user.is_active:
        raise HTTPException(status_code=401, detail="Account is disabled")

    await AuthService.update_last_login(db, user)
    
    access_token = JWTService.create_access_token({"email": user.email, "role": user.role_id})
    refresh_token = JWTService.create_refresh_token({"email": user.email})
    
    return AuthResponse(
        user=user,
        token=Token(access_token=access_token, refresh_token=refresh_token)
    )

@router.post("/logout")
async def logout():
    return {"status": "success"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
