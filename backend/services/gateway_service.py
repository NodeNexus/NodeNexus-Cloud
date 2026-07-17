import docker
import asyncio
import uuid

class GatewayService:
    def __init__(self):
        self.client = docker.from_env()
        self.gateway_name = "vnav-api-gateway"
        self.routes = []

    def _ensure_gateway(self):
        try:
            return self.client.containers.get(self.gateway_name)
        except docker.errors.NotFound:
            return self.client.containers.run(
                "nginx:alpine",
                name=self.gateway_name,
                detach=True,
                ports={"80/tcp": 8080}, # Map to 8080 on host to avoid conflict with frontend
                labels={"vnav.service": "gateway"}
            )

    async def _reload_nginx(self, container):
        # Generate nginx.conf based on routes
        conf = "server {\\n    listen 80;\\n"
        for r in self.routes:
            conf += f"    location {r['path']} {{\\n"
            conf += f"        proxy_pass http://{r['target_ip']}:{r.get('target_port', 80)};\\n"
            conf += "    }\\n"
        conf += "}\\n"
        
        # Write config to container and reload
        cmd = f"sh -c \"echo '{conf}' > /etc/nginx/conf.d/default.conf && nginx -s reload\""
        await asyncio.to_thread(container.exec_run, cmd)

    async def get_routes(self):
        return self.routes

    async def add_route(self, path: str, target_container_id: str, target_port: int = 80):
        def _add():
            target_container = self.client.containers.get(target_container_id)
            target_ip = target_container.attrs['NetworkSettings']['IPAddress']
            
            route = {
                "id": uuid.uuid4().hex[:8],
                "path": path,
                "target_container_id": target_container_id,
                "target_name": target_container.name,
                "target_ip": target_ip,
                "target_port": target_port
            }
            self.routes.append(route)
            gw = self._ensure_gateway()
            return gw, route
        
        gw, route = await asyncio.to_thread(_add)
        await self._reload_nginx(gw)
        return route

    async def delete_route(self, route_id: str):
        self.routes = [r for r in self.routes if r["id"] != route_id]
        def _get_gw():
            return self._ensure_gateway()
        gw = await asyncio.to_thread(_get_gw)
        await self._reload_nginx(gw)
        return {"status": "deleted"}

gateway_service = GatewayService()
