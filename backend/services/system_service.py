import psutil
import socket
import time
from typing import Optional
from schemas.system import SystemStats, DockerSimpleStat
from services.docker_service import DockerService

class SystemService:
    _last_net_io: Optional[dict] = None
    _last_net_time: float = 0
    _docker_service = DockerService()

    @classmethod
    async def get_system_stats(cls) -> SystemStats:
        cpu = psutil.cpu_percent(interval=0)
        ram = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        hostname = socket.gethostname()
        try:
            ip = socket.gethostbyname(hostname)
        except Exception:
            ip = "127.0.0.1"

        # Network Throughput Calculation
        net_io = psutil.net_io_counters()
        current_time = time.time()
        
        rx_speed = 0.0
        tx_speed = 0.0
        
        if cls._last_net_io and cls._last_net_time:
            time_diff = current_time - cls._last_net_time
            if time_diff > 0:
                rx_bytes = net_io.bytes_recv - cls._last_net_io.bytes_recv
                tx_bytes = net_io.bytes_sent - cls._last_net_io.bytes_sent
                
                # Convert to MB/s
                rx_speed = (rx_bytes / time_diff) / (1024 * 1024)
                tx_speed = (tx_bytes / time_diff) / (1024 * 1024)

        cls._last_net_io = net_io
        cls._last_net_time = current_time

        # Uptime
        uptime = int(current_time - psutil.boot_time())

        # Temperature (Mock if sensors not available, standard for Pi is sensors_temperatures)
        temperature = 45.0
        if hasattr(psutil, "sensors_temperatures"):
            temps = psutil.sensors_temperatures()
            if "coretemp" in temps and len(temps["coretemp"]) > 0:
                temperature = temps["coretemp"][0].current
            elif "cpu_thermal" in temps and len(temps["cpu_thermal"]) > 0:
                temperature = temps["cpu_thermal"][0].current

        # Docker Info
        docker_containers = 0
        docker_images = 0
        containers_status = []
        
        if cls._docker_service.client:
            try:
                containers = cls._docker_service.client.containers.list(all=True)
                docker_containers = len(containers)
                containers_status = [DockerSimpleStat(name=c.name, status=c.status) for c in containers[:5]] # Limit to 5 for dashboard
                docker_images = len(cls._docker_service.client.images.list())
            except Exception:
                pass

        return SystemStats(
            hostname=hostname,
            ip=ip,
            cpu=cpu,
            ram_used=ram.used / (1024 ** 2), # MB
            ram_total=ram.total / (1024 ** 2),
            disk_used=disk.used / (1024 ** 3), # GB
            disk_total=disk.total / (1024 ** 3),
            temperature=temperature,
            net_rx=rx_speed,
            net_tx=tx_speed,
            uptime=uptime,
            docker_containers=docker_containers,
            docker_images=docker_images,
            containers_status=containers_status
        )
