from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import docker
import asyncio

router = APIRouter(prefix="/ws/terminal", tags=["Terminal"])

@router.websocket("/{container_id}")
async def terminal_ws(websocket: WebSocket, container_id: str):
    await websocket.accept()
    client = docker.from_env()
    sock = None
    try:
        container = client.containers.get(container_id)
        # Create interactive shell
        resp = client.api.exec_create(container.id, cmd='/bin/sh', stdin=True, tty=True)
        # Get raw socket
        sock = client.api.exec_start(resp['Id'], socket=True)
        sock.setblocking(False)

        async def _read_from_docker():
            loop = asyncio.get_event_loop()
            while True:
                try:
                    data = await loop.run_in_executor(None, sock.recv, 1024)
                    if not data:
                        break
                    await websocket.send_text(data.decode('utf-8', errors='replace'))
                except BlockingIOError:
                    await asyncio.sleep(0.01)
                except Exception as e:
                    break

        async def _write_to_docker():
            loop = asyncio.get_event_loop()
            while True:
                try:
                    data = await websocket.receive_text()
                    await loop.run_in_executor(None, sock.send, data.encode('utf-8'))
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

    except Exception as e:
        print(f"Terminal error: {e}")
        try:
            await websocket.send_text(f"\r\nError connecting to container: {str(e)}\r\n")
        except:
            pass
    finally:
        if sock:
            try:
                sock.close()
            except:
                pass
