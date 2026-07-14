# Security & RBAC

Security is a primary concern for VNAV Cloud given its deep access to the host infrastructure.

## 1. Authentication (JWT)
The system uses JSON Web Tokens (JWT) for stateless authentication.
- Passwords are salted and hashed using `bcrypt`.
- Tokens expire by default after 30 minutes (`ACCESS_TOKEN_EXPIRE_MINUTES`).

## 2. Role-Based Access Control (RBAC)
Not all users have access to all features. VNAV Cloud implements strict RBAC middleware.
- **Admin**: Full access, including Cluster Management and Docker daemon control.
- **Viewer**: Read-only access to monitoring dashboards and metrics. Cannot issue terminal commands or restart containers.

## 3. Docker Socket Hardening
Because VNAV Cloud mounts `/var/run/docker.sock`, any user with Admin privileges effectively has root access to the host machine. 
**Never expose VNAV Cloud directly to the public internet without HTTPS and strong Admin passwords.**

## 4. Reverse Proxy & CORS
CORS issues are eliminated by routing all traffic through the internal Nginx proxy. The frontend never makes cross-origin requests; instead, `http://localhost/api/` is proxied silently to the backend container over the internal Docker bridged network.
