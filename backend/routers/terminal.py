from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
import docker
import asyncio
import concurrent.futures
import struct
from core.security import verify_ws_token, WS_IDLE_TIMEOUT_SECONDS, THREAD_POOL_MAX_WORKERS

router = APIRouter(prefix="/ws/terminal", tags=["Terminal"])

# P2: Shared thread pool with explicit max workers
_executor = concurrent.futures.ThreadPoolExecutor(max_workers=THREAD_POOL_MAX_WORKERS)

# Containers the backend process itself runs in — exec into these is forbidden
_BACKEND_CONTAINER_NAMES = {"vnav-console-backend", "nodenexus-cloud-backend"}


def _strip_docker_header(data: bytes) -> bytes:
    """
    P0 Fix: Docker multiplexed stream format prepends an 8-byte header to each frame:
      [stream_type (1B)] [0x00 0x00 0x00 (3B)] [frame_size (4B big-endian)]
    When tty=True this header is NOT present, but we strip it defensively.
    We detect it by checking if first byte is 0x01 or 0x02 (stdout/stderr markers).
    """
    if len(data) >= 8 and data[0] in (0x01, 0x02, 0x03):
        frame_size = struct.unpack(">I", data[4:8])[0]
        # Heuristic: if stated frame_size matches remaining bytes, it's a muxed frame
        if frame_size == len(data) - 8:
            return data[8:]
    return data


@router.websocket("/{container_id}")
async def terminal_ws(
    websocket: WebSocket,
    container_id: str,
    token: str = Query(default="")
):
    # P0: Verify auth token before accepting the connection
    if not verify_ws_token(token):
        await websocket.close(code=1008)
        return

    await websocket.accept()
    client = docker.from_env()
    sock = None

    try:
        container = client.containers.get(container_id)

        # P0: Prevent exec into the backend container itself
        if container.name in _BACKEND_CONTAINER_NAMES:
            await websocket.send_text("\r\n[DENIED] Cannot exec into the backend control plane.\r\n")
            await websocket.close(code=1008)
            return

        # Create interactive TTY shell
        resp = client.api.exec_create(container.id, cmd='/bin/sh', stdin=True, tty=True)
        sock = client.api.exec_start(resp['Id'], socket=True)
        sock.setblocking(False)

        async def _read_from_docker():
            """Read from Docker socket, strip mux header, forward to browser."""
            buf = bytearray()
            loop = asyncio.get_event_loop()
            while True:
                try:
                    chunk = await loop.run_in_executor(_executor, sock.recv, 4096)
                    if not chunk:
                        # P3: Container exited — send explicit message then close
                        await websocket.send_text("\r\n\r\n[Container exited. Session ended.]\r\n")
                        break
                    # P0: Strip Docker 8-byte multiplexed stream header
                    clean = _strip_docker_header(bytes(chunk))
                    await websocket.send_text(clean.decode('utf-8', errors='replace'))
                except BlockingIOError:
                    await asyncio.sleep(0.01)
                except Exception:
                    break

        async def _write_to_docker():
            """Forward browser keystrokes to Docker socket."""
            loop = asyncio.get_event_loop()
            while True:
                try:
                    # P2: Idle timeout on the write side (awaiting user input)
                    data = await asyncio.wait_for(
                        websocket.receive_text(),
                        timeout=WS_IDLE_TIMEOUT_SECONDS
                    )
                    await loop.run_in_executor(_executor, sock.send, data.encode('utf-8'))
                except asyncio.TimeoutError:
                    await websocket.send_text("\r\n[Session timed out due to inactivity.]\r\n")
                    break
                except WebSocketDisconnect:
                    break
                except Exception:
                    break

        read_task = asyncio.create_task(_read_from_docker())
        write_task = asyncio.create_task(_write_to_docker())

        done, pending = await asyncio.wait(
            [read_task, write_task],
            return_when=asyncio.FIRST_COMPLETED
        )
        for task in pending:
            task.cancel()

    except docker.errors.NotFound:
        try:
            await websocket.send_text(f"\r\n[ERROR] Container '{container_id}' not found.\r\n")
        except Exception:
            pass
    except Exception as e:
        try:
            await websocket.send_text(f"\r\nError: {str(e)}\r\n")
        except Exception:
            pass
    finally:
        if sock:
            try:
                sock.close()
            except Exception:
                pass
