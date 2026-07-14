from fastapi import APIRouter, Depends
from schemas.marketplace import AppInfo, AppInstallRequest
from services.marketplace_service import MarketplaceService
from services.docker_service import DockerService

router = APIRouter(prefix="/marketplace", tags=["Marketplace"])

def get_marketplace_service() -> MarketplaceService:
    return MarketplaceService(DockerService())

@router.get("/apps", response_model=list[AppInfo])
async def list_apps(service: MarketplaceService = Depends(get_marketplace_service)):
    return await service.list_apps()

@router.post("/install")
async def install_app(req: AppInstallRequest, service: MarketplaceService = Depends(get_marketplace_service)):
    return await service.install_app(req)

@router.post("/uninstall")
async def uninstall_app(app_name: str, service: MarketplaceService = Depends(get_marketplace_service)):
    return await service.uninstall_app(app_name)
