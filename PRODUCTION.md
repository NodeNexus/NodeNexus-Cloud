# VNAV Cloud Production Guide

This guide details how to deploy VNAV Cloud in a robust, containerized production environment using Docker Compose.

## Prerequisites
- Docker Engine v24+
- Docker Compose v2+
- A registered domain (for HTTPS)

## 1. Initial Setup

First, clone the repository and set up your environment variables:

```bash
cp .env.example .env
```

Open `.env` and configure your `JWT_SECRET_KEY` and `NGINX_HOST`. It is critical you generate a secure random string for your JWT secret:
```bash
openssl rand -hex 32
```

## 2. Architecture Overview

The `docker-compose.yml` spins up two primary services:
1. **Frontend**: A multi-stage Docker build that compiles the React app into static assets and serves them via an Nginx Reverse Proxy on ports 80/443.
2. **Backend**: A FastAPI Python service that mounts `/var/run/docker.sock` to orchestrate plugins and containers.

The Nginx proxy intelligently routes `/api` traffic directly to the internal Backend container, resolving all CORS issues.

## 3. Starting the Cluster

To build and start the production environment in detached mode:

```bash
docker compose up -d --build
```

You can verify the health of the services using:

```bash
docker compose ps
```

## 4. HTTPS Configuration (Let's Encrypt)

The Nginx configuration (`frontend/nginx.conf`) is ready for HTTPS. To secure your instance:

1. Map your SSL certificates into the frontend container by updating the `docker-compose.yml`:
```yaml
  frontend:
    volumes:
      - /etc/letsencrypt/live/yourdomain.com/fullchain.pem:/etc/ssl/certs/fullchain.pem:ro
      - /etc/letsencrypt/live/yourdomain.com/privkey.pem:/etc/ssl/private/privkey.pem:ro
```
2. Update the `nginx.conf` server block to listen on 443 with SSL directives.

## 5. Development Mode

If you are developing features, use the development compose file which mounts local source code for hot-reloading:

```bash
docker compose -f docker-compose.dev.yml up --build
```
