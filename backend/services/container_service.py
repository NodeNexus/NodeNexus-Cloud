import docker
import asyncio

class ContainerService:
    def __init__(self):
        self.client = docker.from_env()

    async def list_services(self):
        def _list():
            containers = self.client.containers.list(all=True, filters={"label": "vnav.type=ecs"})
            result = []
            for c in containers:
                cluster = c.labels.get("vnav.cluster", "default")
                result.append({
                    "id": c.id[:12],
                    "name": c.name,
                    "image": "".join(c.image.tags),
                    "status": c.status,
                    "cluster": cluster,
                    "created": c.attrs.get("Created")
                })
            return result
        return await asyncio.to_thread(_list)

    async def deploy_service(self, name: str, image: str, cluster: str = "default"):
        def _deploy():
            container = self.client.containers.run(
                image,
                name=f"ecs-{name}-{cluster}",
                detach=True,
                labels={
                    "vnav.type": "ecs",
                    "vnav.cluster": cluster
                }
            )
            return {"id": container.id[:12], "name": container.name, "status": "running"}
        return await asyncio.to_thread(_deploy)

    async def stop_service(self, container_id: str):
        def _stop():
            try:
                c = self.client.containers.get(container_id)
                c.stop(timeout=0)
                c.remove(force=True)
                return {"status": "deleted"}
            except docker.errors.NotFound:
                return {"error": "Container not found"}
        return await asyncio.to_thread(_stop)

container_service = ContainerService()
