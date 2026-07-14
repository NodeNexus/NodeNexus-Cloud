from schemas.marketplace import AppInfo, AppInstallRequest
from services.docker_service import DockerService
from utils.exceptions import MarketplaceError

class MarketplaceService:
    def __init__(self, docker_service: DockerService):
        self.docker_service = docker_service

    async def list_apps(self) -> list[AppInfo]:
        return [
            AppInfo(name="pihole", description="Network-wide Ad Blocking", image="pihole/pihole:latest", category="Networking"),
            AppInfo(name="homeassistant", description="Home Automation", image="homeassistant/home-assistant:latest", category="Home Automation"),
        ]

    async def install_app(self, request: AppInstallRequest) -> dict:
        self.docker_service._check_client()
        try:
            # For simplicity, we just pull and run the image in detached mode
            app_configs = {
                "pihole": {"image": "pihole/pihole:latest", "ports": {'53/tcp': 53, '53/udp': 53, '80/tcp': 8080}},
                "homeassistant": {"image": "homeassistant/home-assistant:latest", "network_mode": "host"}
            }
            
            if request.app_name not in app_configs:
                raise MarketplaceError("App not found in marketplace.")
                
            config = app_configs[request.app_name]
            
            # Use docker run equivalent
            container = self.docker_service.client.containers.run(
                config['image'],
                name=request.app_name,
                detach=True,
                ports=config.get('ports'),
                network_mode=config.get('network_mode')
            )
            return {"status": "installed", "container_id": container.short_id}
        except Exception as e:
            raise MarketplaceError(f"Failed to install app: {e}")

    async def uninstall_app(self, app_name: str) -> dict:
        try:
            container = await self.docker_service.get_container(app_name)
            container.remove(force=True)
            return {"status": "uninstalled"}
        except Exception as e:
            raise MarketplaceError(f"Failed to uninstall app: {e}")
