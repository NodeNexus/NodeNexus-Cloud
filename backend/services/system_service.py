import psutil
import docker
import time
from typing import Dict, Any

class SystemService:
    def __init__(self):
        try:
            self.client = docker.from_env()
        except Exception as e:
            self.client = None
            print(f"Failed to connect to Docker socket: {e}")

    def get_dashboard_metrics(self) -> Dict[str, Any]:
        """
        Gathers live system hardware metrics and orchestration states.
        """
        # Hardware Metrics
        cpu_percent = psutil.cpu_percent(interval=0.1)
        mem = psutil.virtual_memory()
        disk = psutil.disk_usage('/')

        # Docker Metrics
        active_instances = 0
        database_count = 0
        healthy_status = True

        if self.client:
            try:
                containers = self.client.containers.list(all=True)
                for c in containers:
                    if c.status == "running":
                        active_instances += 1
                        # Basic heuristic for databases
                        image_name = "".join(c.image.tags).lower()
                        if any(db in image_name for db in ["postgres", "mysql", "mongo", "redis", "mariadb"]):
                            database_count += 1
                    
                    if c.status == "exited" and c.attrs.get("State", {}).get("ExitCode", 0) != 0:
                        healthy_status = False
            except Exception:
                pass

        return {
            "timestamp": int(time.time()),
            "hardware": {
                "cpu_percent": cpu_percent,
                "memory_percent": mem.percent,
                "memory_used_gb": round(mem.used / (1024**3), 2),
                "memory_total_gb": round(mem.total / (1024**3), 2),
                "disk_percent": disk.percent,
                "disk_used_gb": round(disk.used / (1024**3), 2),
                "disk_total_gb": round(disk.total / (1024**3), 2),
            },
            "orchestration": {
                "active_instances": active_instances,
                "database_count": database_count,
                "healthy": healthy_status
            },
            "recent_alerts": []
        }
        
    def list_all_containers(self):
        if not self.client: return []
        try:
            return [{"id": c.id[:12], "name": c.name, "image": "".join(c.image.tags)} for c in self.client.containers.list()]
        except:
            return []

# Module-level singleton — imported by routers/system.py
system_service = SystemService()
