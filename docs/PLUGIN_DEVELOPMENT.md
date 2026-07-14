# Plugin Development Guide

VNAV Cloud is designed so that NO applications are hardcoded into the platform. Everything is a plugin.

## The Plugin Manifest

To create a plugin, you must write a `plugin.json` manifest.

```json
{
  "id": "com.vnav.grafana",
  "name": "Grafana Dashboard",
  "description": "Advanced metrics visualization.",
  "version": "1.0.0",
  "author": "VNAV Team",
  "category": "Monitoring",
  "docker_image": "grafana/grafana:latest",
  "ports": ["3000:3000"],
  "volumes": ["grafana-data:/var/lib/grafana"]
}
```

## How It Works
When a user installs a plugin via the Marketplace, VNAV Cloud parses the manifest and dynamically generates the required Docker container configuration using the `docker` SDK. It automatically handles port mapping and volume provisioning.

## Publishing
Currently, plugins can be sideloaded by placing the `plugin.json` into the `/app/plugins` directory of the backend container. Future updates will introduce a centralized registry API.
