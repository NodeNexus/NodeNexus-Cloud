import docker
import asyncio
import uuid
from core.security import is_image_allowed

class EC2Service:
    def __init__(self):
        self.client = docker.from_env()

    async def list_instances(self):
        def _list():
            containers = self.client.containers.list(all=True, filters={"label": "vnav.service=ec2"})
            return [
                {
                    "id": c.short_id,
                    "name": c.name,
                    "status": c.status,
                    "image": c.image.tags[0] if c.image.tags else c.image.id,
                    "created": c.attrs.get("Created")
                }
                for c in containers
            ]
        return await asyncio.to_thread(_list)

    async def run_instance(self, image: str, instance_type: str = "t2.micro", name: str | None = None):
        # P0: Enforce image allowlist before pulling or running anything
        if not is_image_allowed(image):
            raise ValueError(
                f"Image '{image}' is not in the allowed list. "
                f"Only official/trusted images may be used."
            )

        mem_limit = "512m" if instance_type == "t2.micro" else "1g"

        def _run():
            container_name = name if name else f"i-{uuid.uuid4().hex[:8]}"
            container = self.client.containers.run(
                image,
                detach=True,
                name=container_name,
                mem_limit=mem_limit,
                # P0: Drop all capabilities and run unprivileged
                cap_drop=["ALL"],
                security_opt=["no-new-privileges:true"],
                labels={"vnav.service": "ec2"}
            )
            return {
                "id": container.short_id,
                "name": container_name,
                "status": "running"
            }
        return await asyncio.to_thread(_run)

    async def terminate_instance(self, instance_id: str):
        def _terminate():
            container = self.client.containers.get(instance_id)
            container.stop()
            container.remove()
            return {"status": "terminated"}
        return await asyncio.to_thread(_terminate)

ec2_service = EC2Service()
