# Installation Guide

## Prerequisites
- Docker Engine v24.0 or higher
- Docker Compose v2.0 or higher
- Git

## Production Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/vnav/vnav-cloud.git
   cd vnav-cloud
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   Open `.env` and generate a highly secure 32-character string for `JWT_SECRET_KEY`.

3. **Deploy**
   ```bash
   docker compose up -d --build
   ```
   The platform will boot up. The frontend will be available on port `80`.

## Updating

VNAV Cloud features a built-in Update Center, but you can also update manually via Git:

```bash
git pull origin main
docker compose up -d --build
```
