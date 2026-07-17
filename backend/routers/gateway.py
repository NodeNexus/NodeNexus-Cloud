from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.gateway_service import gateway_service

router = APIRouter(prefix="/gateway", tags=["Gateway"])

class RouteCreateRequest(BaseModel):
    path: str
    target_container_id: str
    target_port: int = 80

@router.get("/routes")
async def get_routes():
    try:
        return await gateway_service.get_routes()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/routes")
async def add_route(req: RouteCreateRequest):
    try:
        if not req.path.startswith("/"):
            req.path = "/" + req.path
        return await gateway_service.add_route(req.path, req.target_container_id, req.target_port)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/routes/{route_id}")
async def delete_route(route_id: str):
    try:
        return await gateway_service.delete_route(route_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
