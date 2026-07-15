import docker
import asyncio

class EBSService:
    def __init__(self):
        self.client = docker.from_env()

    async def list_volumes(self):
        def _list():
            volumes = self.client.volumes.list(filters={"label": "vnav.service=ebs"})
            return [{"name": v.name, "driver": v.attrs.get("Driver")} for v in volumes]
        return await asyncio.to_thread(_list)

    async def create_volume(self, name: str):
        def _create():
            volume = self.client.volumes.create(
                name,
                labels={"vnav.service": "ebs"}
            )
            return {"name": volume.name}
        return await asyncio.to_thread(_create)

    async def delete_volume(self, name: str):
        def _delete():
            volume = self.client.volumes.get(name)
            volume.remove()
            return {"status": "deleted"}
        return await asyncio.to_thread(_delete)

ebs_service = EBSService()
