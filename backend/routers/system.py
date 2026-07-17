from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from services.system_service import system_service
import asyncio
import docker
import concurrent.futures
from core.security import verify_ws_token, WS_IDLE_TIMEOUT_SECONDS, THREAD_POOL_MAX_WORKERS

router = APIRouter(prefix="/api/system", tags=["System"])

# P2: Shared thread pool with explicit max workers
_executor = concurrent.futures.ThreadPoolExecutor(max_workers=THREAD_POOL_MAX_WORKERS)

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
    except Exception:
        pass

    history = []
    base_cost = max(cost_per_hr * 24, 2.50)
    for i in range(7, 0, -1):
        history.append({
            "day": f"Day -{i}",
            "cost": round(base_cost * (0.8 + 0.4 * (i % 3)), 2)
        })

    return {
        "current_hourly_rate": round(cost_per_hr, 4),
        "projected_monthly": round(cost_per_hr * 730, 2),
        "breakdown": {k: round(v, 2) for k, v in breakdown.items()},
        "history": history
    }


@router.websocket("/ws/logs/{container_id}")
async def stream_logs_ws(
    websocket: WebSocket,
    container_id: str,
    token: str = Query(default="")
):
    # P0: Verify auth token before accepting
    if not verify_ws_token(token):
        await websocket.close(code=1008)
        return

    await websocket.accept()
    client = docker.from_env()
    loop = asyncio.get_running_loop()

    try:
        container = client.containers.get(container_id)
    except docker.errors.NotFound:
        await websocket.send_text(f"[ERROR] Container '{container_id}' not found.\n")
        await websocket.close()
        return

    logs = container.logs(stream=True, follow=True, tail=100)

    async def _stream():
        while True:
            try:
                # P2: Use shared thread pool executor
                line = await loop.run_in_executor(_executor, next, logs)
                await websocket.send_text(line.decode('utf-8', errors='replace'))
            except StopIteration:
                await websocket.send_text("\n[Container stopped. Log stream ended.]\n")
                break
            except Exception:
                break

    try:
        # P2: Apply idle timeout to entire stream
        await asyncio.wait_for(_stream(), timeout=WS_IDLE_TIMEOUT_SECONDS)
    except asyncio.TimeoutError:
        try:
            await websocket.send_text("\n[Log stream timed out due to inactivity.]\n")
        except Exception:
            pass
    except WebSocketDisconnect:
        pass
    finally:
        try:
            await websocket.close()
        except Exception:
            pass
