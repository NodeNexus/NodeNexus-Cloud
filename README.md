# VNAV Cloud

<div align="center">
  <h3>The Next-Generation Self-Hosted Edge Cloud & AI Operations Center</h3>
</div>

VNAV Cloud is a highly modular, containerized platform built to orchestrate Docker workloads, manage Edge computing clusters (Kubernetes), and provide an advanced AI Operations Center powered by Ollama.

## Core Features

- **Docker & Container Orchestration**: Full lifecycle management of Docker containers, images, volumes, and networks directly from a beautiful UI.
- **Edge Cluster Management**: Connect multiple nodes via Kubernetes. Monitor CPU, Memory, and Edge devices in real-time.
- **AI Operations Center (VNAV AI)**: Built-in local AI using Ollama. Chat with your infrastructure, generate docker-compose files, and automate terminal tasks securely.
- **Extensible Plugin Marketplace**: Never hardcode an app again. Install 1-click plugins from the integrated App Store.
- **Robust Telemetry**: Real-time WebSockets, metrics, and an advanced Notification/Alerting engine.

## Quickstart

VNAV Cloud is designed for instant deployment using Docker Compose.

```bash
git clone https://github.com/vnav/vnav-cloud.git
cd vnav-cloud

# Copy the environment file and set your JWT secret
cp .env.example .env

# Launch the production cluster
docker compose up -d --build
```
Access the dashboard at `http://localhost`.

## Documentation Hub

We have extensive documentation covering every aspect of the platform:

**Core**
- [Installation Guide](docs/INSTALLATION.md)
- [Architecture Overview](docs/ARCHITECTURE.md)

**Operations**
- [Docker Configuration](docs/DOCKER.md)
- [Production Deployment](docs/DEPLOYMENT.md)
- [Cluster & Edge Computing](docs/CLUSTER.md)
- [Security & RBAC](docs/SECURITY.md)

**Development**
- [Development Setup](docs/DEVELOPMENT.md)
- [API Reference](docs/API.md)
- [Contributing Guidelines](docs/CONTRIBUTING.md)

**Extensibility**
- [Plugin Development](docs/PLUGIN_DEVELOPMENT.md)
- [Marketplace Integration](docs/MARKETPLACE.md)
- [AI Agent Development](docs/AI_DEVELOPMENT.md)

## Tech Stack
- **Frontend**: React 18, TypeScript, TailwindCSS v4, Framer Motion, Zustand, Vite.
- **Backend**: Python 3.13, FastAPI, SQLite/PostgreSQL, Docker SDK, WebSockets.
- **Infrastructure**: Docker, Nginx Reverse Proxy.
