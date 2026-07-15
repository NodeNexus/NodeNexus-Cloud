import docker
import asyncio

class VPCService:
    def __init__(self):
        self.client = docker.from_env()

    async def list_networks(self):
        def _list():
            networks = self.client.networks.list(filters={"label": "vnav.service=vpc"})
            return [{"id": n.short_id, "name": n.name, "driver": n.attrs.get("Driver")} for n in networks]
        return await asyncio.to_thread(_list)

    async def create_network(self, name: str, driver: str = "bridge"):
        def _create():
            network = self.client.networks.create(
                name,
                driver=driver,
                labels={"vnav.service": "vpc"}
            )
            return {"id": network.short_id, "name": name}
        return await asyncio.to_thread(_create)

    async def delete_network(self, network_id: str):
        def _delete():
            network = self.client.networks.get(network_id)
            network.remove()
            return {"status": "deleted"}
        return await asyncio.to_thread(_delete)

vpc_service = VPCService()
