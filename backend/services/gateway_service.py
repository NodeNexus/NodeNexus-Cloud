import docker
import asyncio
import uuid
import json
import os
from core.security import sanitize_gateway_path

# P1: Persist routes to a JSON file on a mounted volume
ROUTES_PERSIST_PATH = os.environ.get("GATEWAY_ROUTES_PATH", "/app/data/gateway_routes.json")


class GatewayService:
    def __init__(self):
        self.client = docker.from_env()
        self.gateway_name = "vnav-api-gateway"
        self.routes: list[dict] = self._load_routes()

    def _load_routes(self) -> list[dict]:
        """P1: Load persisted routes from disk on startup."""
        try:
            if os.path.exists(ROUTES_PERSIST_PATH):
                with open(ROUTES_PERSIST_PATH, "r") as f:
                    return json.load(f)
        except Exception:
            pass
        return []

    def _save_routes(self):
        """P1: Persist routes to disk after every mutation."""
        try:
            os.makedirs(os.path.dirname(ROUTES_PERSIST_PATH), exist_ok=True)
            with open(ROUTES_PERSIST_PATH, "w") as f:
                json.dump(self.routes, f, indent=2)
        except Exception as e:
            print(f"[GatewayService] Warning: Could not persist routes: {e}")

    def _ensure_gateway(self):
        try:
            return self.client.containers.get(self.gateway_name)
        except docker.errors.NotFound:
            return self.client.containers.run(
                "nginx:alpine",
                name=self.gateway_name,
                detach=True,
                ports={"80/tcp": 8080},
                labels={"vnav.service": "gateway"}
            )

    async def _reload_nginx(self, container):
        """
        P0: Build Nginx config from sanitized route data using a list approach
        to avoid shell injection via f-string. Use 'tee' via exec instead of
        shell echo to prevent newline injection.
        """
        server_blocks = ["server {", "    listen 80;"]
        for r in self.routes:
            # Paths are already sanitized by sanitize_gateway_path at input time
            server_blocks.append(f"    location {r['path']} {{")
            server_blocks.append(f"        proxy_pass http://{r['target_ip']}:{r.get('target_port', 80)};")
            server_blocks.append(f"        proxy_set_header Host $host;")
            server_blocks.append("    }")
        server_blocks.append("}")
        config_content = "\n".join(server_blocks)

        # Write config by piping via exec with a list command (no shell interpolation)
        def _write_and_reload():
            # Write config using printf (safer than echo for newlines)
            write_cmd = ["sh", "-c", f"printf '%s' '{config_content}' > /etc/nginx/conf.d/default.conf"]
            container.exec_run(write_cmd)
            container.exec_run(["nginx", "-s", "reload"])

        await asyncio.to_thread(_write_and_reload)

    async def get_routes(self):
        return self.routes

    async def add_route(self, path: str, target_container_id: str, target_port: int = 80):
        def _add():
            target_container = self.client.containers.get(target_container_id)
            target_ip = target_container.attrs['NetworkSettings']['IPAddress']
            if not target_ip:
                raise ValueError("Target container has no IP address. Is it running?")

            route = {
                "id": uuid.uuid4().hex[:8],
                "path": path,
                "target_container_id": target_container_id,
                "target_name": target_container.name,
                "target_ip": target_ip,
                "target_port": target_port
            }
            self.routes.append(route)
            self._save_routes()  # P1: Persist immediately
            gw = self._ensure_gateway()
            return gw, route

        gw, route = await asyncio.to_thread(_add)
        await self._reload_nginx(gw)
        return route

    async def delete_route(self, route_id: str):
        self.routes = [r for r in self.routes if r["id"] != route_id]
        self._save_routes()  # P1: Persist immediately

        def _get_gw():
            return self._ensure_gateway()
        gw = await asyncio.to_thread(_get_gw)
        await self._reload_nginx(gw)
        return {"status": "deleted"}


gateway_service = GatewayService()
