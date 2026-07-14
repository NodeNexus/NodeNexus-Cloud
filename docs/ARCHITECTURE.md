# Architecture Overview

VNAV Cloud follows a decoupled, highly modular Client-Server architecture, bound together by REST APIs and WebSockets.

## 1. Frontend (React SPA)
The frontend is built with React and heavily optimized using Vite.
- **State Management**: `zustand` is used for global state (auth tokens, user profiles).
- **Data Fetching**: `@tanstack/react-query` is utilized for caching API responses and managing loading/error states.
- **Styling**: TailwindCSS v4 with a custom class-based Theme Engine (Dark/Light/System) and Glassmorphic aesthetics.
- **Routing**: React Router with lazy-loaded code-splitting for optimal bundle sizes.

## 2. Backend (FastAPI)
The backend is a high-performance ASGI application written in Python 3.13.
- **Concurrency**: Fully `async/await` driven using `aiosqlite` and asynchronous router handlers.
- **Security**: PyJWT handles stateless authentication. Passwords are encrypted via `bcrypt`.
- **Infrastructure Control**: The backend mounts the host's `/var/run/docker.sock` to natively control containers via the official `docker` Python SDK.

## 3. Storage Layer
- **SQLite (Default)**: Fast, file-based SQL storage mounted via a Docker volume for state persistence.
- **Extensibility**: The database layer uses SQLAlchemy, meaning it can be effortlessly migrated to PostgreSQL by simply changing the `DATABASE_URL` in the `.env` file.
