import os
import json
from pathlib import Path

plugins_data = [
    {"id": "grafana", "name": "Grafana", "category": "Monitoring", "image": "grafana/grafana:latest", "port": "3000"},
    {"id": "prometheus", "name": "Prometheus", "category": "Monitoring", "image": "prom/prometheus:latest", "port": "9090"},
    {"id": "loki", "name": "Loki", "category": "Monitoring", "image": "grafana/loki:latest", "port": "3100"},
    {"id": "minio", "name": "MinIO", "category": "Storage", "image": "minio/minio:latest", "port": "9000"},
    {"id": "redis", "name": "Redis", "category": "Databases", "image": "redis:latest", "port": "6379"},
    {"id": "postgresql", "name": "PostgreSQL", "category": "Databases", "image": "postgres:latest", "port": "5432"},
    {"id": "nodered", "name": "NodeRED", "category": "IoT", "image": "nodered/node-red:latest", "port": "1880"},
    {"id": "mqtt", "name": "Eclipse Mosquitto", "category": "IoT", "image": "eclipse-mosquitto:latest", "port": "1883"},
    {"id": "portainer", "name": "Portainer", "category": "Containers", "image": "portainer/portainer-ce:latest", "port": "9000"},
    {"id": "homeassistant", "name": "Home Assistant", "category": "IoT", "image": "homeassistant/home-assistant:stable", "port": "8123"},
    {"id": "jellyfin", "name": "Jellyfin", "category": "Media", "image": "jellyfin/jellyfin:latest", "port": "8096"},
    {"id": "nextcloud", "name": "Nextcloud", "category": "Storage", "image": "nextcloud:latest", "port": "80"},
    {"id": "vaultwarden", "name": "Vaultwarden", "category": "Security", "image": "vaultwarden/server:latest", "port": "80"},
    {"id": "pihole", "name": "Pi-hole", "category": "Networking", "image": "pihole/pihole:latest", "port": "80"},
    {"id": "nginxproxymanager", "name": "Nginx Proxy Manager", "category": "Networking", "image": "jc21/nginx-proxy-manager:latest", "port": "81"},
    {"id": "traefik", "name": "Traefik", "category": "Networking", "image": "traefik:latest", "port": "8080"},
    {"id": "gitea", "name": "Gitea", "category": "Development", "image": "gitea/gitea:latest", "port": "3000"},
    {"id": "jenkins", "name": "Jenkins", "category": "Development", "image": "jenkins/jenkins:lts", "port": "8080"},
    {"id": "ollama", "name": "Ollama", "category": "AI", "image": "ollama/ollama:latest", "port": "11434"},
    {"id": "openwebui", "name": "Open WebUI", "category": "AI", "image": "ghcr.io/open-webui/open-webui:main", "port": "8080"},
    {"id": "k3s", "name": "K3s", "category": "Containers", "image": "rancher/k3s:latest", "port": "6443"},
]

base_dir = Path("plugins")
base_dir.mkdir(exist_ok=True)

for p in plugins_data:
    plugin_dir = base_dir / p["id"]
    plugin_dir.mkdir(exist_ok=True)
    
    manifest = {
        "id": p["id"],
        "name": p["name"],
        "description": f"Official docker image for {p['name']}.",
        "version": "latest",
        "author": "VNAV Cloud",
        "category": p["category"],
        "docker_image": p["image"],
        "ports": {p["port"]: p["port"]}
    }
    
    with open(plugin_dir / "plugin.json", "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

print("Created 21 plugin manifests.")
