import docker
import asyncio
import uuid

class EC2Service:
    def __init__(self):
        # We assume the docker socket is mounted to the container
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

    async def run_instance(self, image: str, instance_type: str = "t2.micro"):
        # For our RPi, instance_type determines memory/CPU limits
        mem_limit = "512m" if instance_type == "t2.micro" else "1g"
        
        def _run():
            name = f"i-{uuid.uuid4().hex[:8]}"
            container = self.client.containers.run(
                image,
                detach=True,
                name=name,
                mem_limit=mem_limit,
                labels={"vnav.service": "ec2"}
            )
            return {
                "id": container.short_id,
                "name": name,
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
