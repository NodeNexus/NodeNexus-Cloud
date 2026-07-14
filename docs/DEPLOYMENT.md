# Production Deployment Guide

Deploying VNAV Cloud to a production server requires a few extra steps for security and scalability.

## 1. Environment Variables
Never use default keys in production. Ensure your `.env` contains:
```bash
ENVIRONMENT=production
JWT_SECRET_KEY=generate_a_long_secure_string
```

## 2. Setting up HTTPS (Let's Encrypt)
By default, the Nginx container proxies port 80. To secure this:
1. Generate an SSL certificate on your host machine using `certbot`.
2. Map the certificate directories into the `frontend` container inside your `docker-compose.yml`:
   ```yaml
   volumes:
     - /etc/letsencrypt/live/yourdomain.com/fullchain.pem:/etc/ssl/certs/fullchain.pem:ro
     - /etc/letsencrypt/live/yourdomain.com/privkey.pem:/etc/ssl/private/privkey.pem:ro
   ```
3. Update `frontend/nginx.conf` to listen on 443 with SSL directives enabled.

## 3. High Availability (PostgreSQL)
For multi-node setups, you should abandon the local SQLite database.
Spin up a PostgreSQL cluster and update the `DATABASE_URL` in the `.env` file to point to it:
`DATABASE_URL=postgresql+asyncpg://user:pass@host/dbname`
