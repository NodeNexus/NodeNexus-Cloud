import psutil
from schemas.monitoring import SystemMetrics

class MonitoringService:
    @staticmethod
    def get_system_metrics() -> SystemMetrics:
        # CPU
        cpu = psutil.cpu_percent(interval=None)
        
        # Memory
        mem = psutil.virtual_memory()
        
        # Storage (Root)
        try:
            disk = psutil.disk_usage('/')
            storage_pct = disk.percent
        except Exception:
            storage_pct = 0.0
            
        # Network (Bytes)
        net = psutil.net_io_counters()
        
        return SystemMetrics(
            cpu=cpu,
            memory=mem.percent,
            storage=storage_pct,
            network_rx=net.bytes_recv,
            network_tx=net.bytes_sent
        )
