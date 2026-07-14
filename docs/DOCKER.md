# Docker Integration

VNAV Cloud is heavily integrated with Docker at the OS level. It uses the `docker` Python SDK to communicate with the host daemon socket.

## Architecture
The backend container is mounted with `/var/run/docker.sock`. This allows the FastAPI application to orchestrate containers exactly as if you were running `docker run` natively on the host machine.

### Multi-stage Build
The `frontend/Dockerfile` uses a two-stage build process.
1. The `node:20` layer downloads dependencies and compiles the React app.
2. The `nginx:alpine` layer copies only the static `dist/` directory, resulting in an incredibly small (~20MB) and secure image.

## Compose Setup
- **Network**: All containers run on a bridged network `vnav-network` for DNS resolution.
- **Volumes**: `vnav_db_data` is used to persist the internal SQLite state. `vnav_plugins_data` persists downloaded plugin manifests.

## Updating Images
The VNAV Cloud update center interacts with the Docker SDK to dynamically pull new image versions (like `ollama/ollama`) and orchestrate restarting the containers automatically without manual intervention.
