# API Reference

VNAV Cloud exposes a fully-documented REST API powered by FastAPI.

## Interactive Documentation
When running the backend locally or in development mode, you can access the interactive Swagger UI at:
- `http://localhost:8000/docs`

## Authentication
Most endpoints require a valid JWT Bearer token.
```http
Authorization: Bearer <your_token_here>
```

## WebSockets
Real-time features (like Docker logs and Terminal sessions) are served over WebSockets.
Example endpoint: `ws://localhost/api/docker/logs/{container_id}`

The WebSocket connections also expect token authentication, usually passed via subprotocols or initial setup frames.
