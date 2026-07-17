from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.system_service import system_service
import asyncio
import docker

router = APIRouter(prefix="/api/system", tags=["System"])
system_service = SystemService()

@router.get("/dashboard")
async def get_dashboard():
    """Returns live hardware and orchestration metrics for the frontend Dashboard."""
    return system_service.get_dashboard_metrics()

@router.get("/containers")
async def get_all_containers():
    """Returns all running Docker containers for tools to select from."""
    return system_service.list_all_containers()

@router.get("/billing")
async def get_billing():
    """Returns mocked billing data based on running containers."""
    client = docker.from_env()
    cost_per_hr = 0
    breakdown = {"Compute": 0, "Database": 0, "Network": 0}
    
    try:
        for c in client.containers.list():
            img = "".join(c.image.tags).lower()
            if any(db in img for db in ["postgres", "mysql", "mongo", "redis", "mariadb"]):
                cost_per_hr += 0.05
                breakdown["Database"] += 0.05
            elif "nginx" in img and c.name == "vnav-api-gateway":
                cost_per_hr += 0.01
                breakdown["Network"] += 0.01
            else:
                cost_per_hr += 0.02
                breakdown["Compute"] += 0.02
    except:
        pass

    history = []
    base_cost = max(cost_per_hr * 24, 2.50)
    for i in range(7, 0, -1):
        history.append({
            "day": f"Day -{i}",
            "cost": round(base_cost * (0.8 + 0.4 * (i%3)), 2)
        })
        
    return {
        "current_hourly_rate": round(cost_per_hr, 4),
        "projected_monthly": round(cost_per_hr * 730, 2),
        "breakdown": {k: round(v, 2) for k, v in breakdown.items()},
        "history": history
    }

@router.websocket("/ws/logs/{container_id}")
async def stream_logs_ws(websocket: WebSocket, container_id: str):
    await websocket.accept()
    client = docker.from_env()
    loop = asyncio.get_running_loop()
    try:
        container = client.containers.get(container_id)
        logs = container.logs(stream=True, follow=True, tail=100)
        while True:
            line = await loop.run_in_executor(None, next, logs)
            await websocket.send_text(line.decode('utf-8', errors='replace'))
    except Exception:
        pass
    finally:
        try:
            await websocket.close()
        except:
            pass
