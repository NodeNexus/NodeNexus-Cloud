from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, field_validator
from services.gateway_service import gateway_service
from core.security import sanitize_gateway_path

router = APIRouter(prefix="/gateway", tags=["Gateway"])


class RouteCreateRequest(BaseModel):
    path: str
    target_container_id: str
    target_port: int = 80

    @field_validator("path")
    @classmethod
    def validate_path(cls, v: str) -> str:
        # P0: Sanitize and validate gateway path to prevent Nginx config injection
        return sanitize_gateway_path(v)

    @field_validator("target_port")
    @classmethod
    def validate_port(cls, v: int) -> int:
        if not (1 <= v <= 65535):
            raise ValueError("Port must be between 1 and 65535.")
        return v


@router.get("/routes")
async def get_routes():
    try:
        return await gateway_service.get_routes()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/routes")
async def add_route(req: RouteCreateRequest):
    try:
        return await gateway_service.add_route(req.path, req.target_container_id, req.target_port)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/routes/{route_id}")
async def delete_route(route_id: str):
    try:
        return await gateway_service.delete_route(route_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
