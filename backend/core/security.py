import os
import re

# --- Image Allowlist (P0 Fix) ---
ALLOWED_IMAGE_PREFIXES = [
    "ubuntu:", "debian:", "alpine:", "python:", "node:", "nginx:",
    "postgres:", "mysql:", "mariadb:", "mongo:", "redis:",
    "httpd:", "busybox:", "centos:", "fedora:", "amazon/",
    "library/", "openjdk:", "golang:", "php:", "ruby:",
]

# --- Path Safety (P0 Fix) ---
ALLOWED_FILE_ROOTS = ["/tmp", "/var/log", "/home", "/app", "/data", "/workspace"]

# --- WebSocket Auth (P0 Fix) ---
# Set this env var to require token auth on WebSocket connections.
# Leave empty to disable auth (local-only dev mode).
WS_SECRET_TOKEN = os.environ.get("WS_SECRET_TOKEN", "")

# --- CORS Origins (P1 Fix) ---
# Comma-separated list of allowed origins. Defaults to localhost dev servers.
CORS_ORIGINS_RAW = os.environ.get(
    "CORS_ORIGINS",
    "http://localhost,http://localhost:80,http://localhost:5173,http://127.0.0.1"
)
CORS_ORIGINS = [o.strip() for o in CORS_ORIGINS_RAW.split(",") if o.strip()]

# --- Thread Pool (P2 Fix) ---
THREAD_POOL_MAX_WORKERS = int(os.environ.get("THREAD_POOL_MAX_WORKERS", "200"))

# --- WebSocket Idle Timeout (P2 Fix) ---
WS_IDLE_TIMEOUT_SECONDS = int(os.environ.get("WS_IDLE_TIMEOUT_SECONDS", "600"))  # 10 minutes

def is_image_allowed(image: str) -> bool:
    """Check if a Docker image name is in the allowlist."""
    image_lower = image.lower().split("@")[0]  # Strip digest
    for prefix in ALLOWED_IMAGE_PREFIXES:
        if image_lower.startswith(prefix) or image_lower == prefix.rstrip(":"):
            return True
    return False

def sanitize_path(path: str, container_id: str = "") -> str:
    """
    Sanitize a filesystem path to prevent path traversal attacks.
    Raises ValueError if the path is dangerous.
    """
    if not path:
        return "/tmp"
    # Normalize and resolve
    normalized = os.path.normpath(path)
    # Reject traversal attempts
    if ".." in normalized.split(os.sep):
        raise ValueError(f"Path traversal detected: {path}")
    # Reject dangerous patterns
    if re.search(r'[;\|&`$]', path):
        raise ValueError(f"Shell metacharacters detected in path: {path}")
    # Must start with an allowed root
    allowed = any(normalized.startswith(root) for root in ALLOWED_FILE_ROOTS)
    if not allowed:
        raise ValueError(
            f"Path '{normalized}' is not under an allowed root: {ALLOWED_FILE_ROOTS}"
        )
    return normalized

def sanitize_gateway_path(path: str) -> str:
    """
    Sanitize an Nginx location path to prevent config injection.
    Only allows alphanumeric, hyphens, underscores, and forward slashes.
    """
    if not path.startswith("/"):
        path = "/" + path
    if not re.match(r'^[a-zA-Z0-9/_\-\.]+$', path):
        raise ValueError(f"Invalid gateway path '{path}'. Only alphanumeric, '/', '-', '_', '.' allowed.")
    if ".." in path:
        raise ValueError("Path traversal in gateway path.")
    return path

def verify_ws_token(token: str) -> bool:
    """Verify WebSocket auth token. Returns True if auth is disabled or token matches."""
    if not WS_SECRET_TOKEN:
        return True  # Auth disabled (dev mode)
    return token == WS_SECRET_TOKEN
