import docker
from schemas.docker import ContainerInfo, ImageInfo, DockerActionResponse
from utils.exceptions import DockerException, ResourceNotFound
from utils.logger import get_logger

logger = get_logger(__name__)

class DockerService:
    def __init__(self):
        try:
            self.client = docker.from_env()
        except Exception as e:
            logger.error(f"Failed to initialize Docker client: {e}")
            self.client = None

    def _check_client(self):
        if not self.client:
            raise DockerException("Docker daemon is not accessible.")

    async def list_containers(self) -> list[ContainerInfo]:
        self._check_client()
        containers = self.client.containers.list(all=True)
        return [
            ContainerInfo(
                id=c.short_id,
                name=c.name,
                image=c.image.tags[0] if c.image.tags else c.image.id,
                status=c.status,
                ports=c.ports,
                created=c.attrs.get('Created', '')
            ) for c in containers
        ]

    async def list_images(self) -> list[ImageInfo]:
        self._check_client()
        images = self.client.images.list()
        return [
            ImageInfo(
                id=i.short_id,
                tags=i.tags,
                size=i.attrs.get('Size', 0),
                created=i.attrs.get('Created', '')
            ) for i in images
        ]

    async def get_container(self, container_id: str):
        self._check_client()
        try:
            return self.client.containers.get(container_id)
        except docker.errors.NotFound:
            raise ResourceNotFound(f"Container {container_id} not found.")
        except Exception as e:
            raise DockerException(str(e))

    async def start_container(self, container_id: str) -> DockerActionResponse:
        c = await self.get_container(container_id)
        c.start()
        return DockerActionResponse(status="started", message="Container started.", container_id=container_id)

    async def stop_container(self, container_id: str) -> DockerActionResponse:
        c = await self.get_container(container_id)
        c.stop()
        return DockerActionResponse(status="stopped", message="Container stopped.", container_id=container_id)

    async def restart_container(self, container_id: str) -> DockerActionResponse:
        c = await self.get_container(container_id)
        c.restart()
        return DockerActionResponse(status="restarted", message="Container restarted.", container_id=container_id)

    async def delete_container(self, container_id: str) -> DockerActionResponse:
        c = await self.get_container(container_id)
        c.remove(force=True)
        return DockerActionResponse(status="deleted", message="Container deleted.", container_id=container_id)

    async def get_logs(self, container_id: str, tail: int = 100) -> str:
        c = await self.get_container(container_id)
        logs = c.logs(tail=tail, stdout=True, stderr=True)
        return logs.decode('utf-8', errors='replace')

    async def get_container_details(self, container_id: str) -> dict:
        c = await self.get_container(container_id)
        stats = c.stats(stream=False)
        return {
            "id": c.short_id,
            "name": c.name,
            "image": c.image.tags[0] if c.image.tags else c.image.id,
            "status": c.status,
            "ports": c.ports,
            "created": c.attrs.get('Created', ''),
            "stats": stats,
            "env": c.attrs.get('Config', {}).get('Env', []),
            "cmd": c.attrs.get('Config', {}).get('Cmd', [])
        }

    async def create_container(self, image: str, name: str = None, ports: dict = None, env: list = None, command: str = None):
        self._check_client()
        try:
            kwargs = {"detach": True}
            if name: kwargs["name"] = name
            if ports: kwargs["ports"] = ports
            if env: kwargs["environment"] = env
            if command: kwargs["command"] = command
            
            c = self.client.containers.run(image, **kwargs)
            return DockerActionResponse(status="created", message="Container created.", container_id=c.short_id)
        except Exception as e:
            raise DockerException(str(e))

    async def pull_image(self, image: str):
        self._check_client()
        try:
            self.client.images.pull(image)
            return DockerActionResponse(status="pulled", message=f"Image {image} pulled.")
        except Exception as e:
            raise DockerException(str(e))

    async def prune_system(self):
        self._check_client()
        try:
            containers_pruned = self.client.containers.prune()
            images_pruned = self.client.images.prune()
            
            return {
                "containers_deleted": containers_pruned.get("ContainersDeleted") or [],
                "images_deleted": images_pruned.get("ImagesDeleted") or [],
                "space_reclaimed": (containers_pruned.get("SpaceReclaimed") or 0) + (images_pruned.get("SpaceReclaimed") or 0)
            }
        except Exception as e:
            raise DockerException(str(e))

