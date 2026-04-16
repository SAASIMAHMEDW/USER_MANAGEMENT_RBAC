# Purple Merit Docker Setup

## Quick Start

1. **Create environment file for server:**
   ```bash
   cp server/.env.docker server/.env
   ```

2. **Update server/.env with your values:**
   - Set strong JWT secrets (minimum 32 characters)
   - Keep MONGO_URI as `mongodb://mongodb:27017/usermgmt`

3. **Build and run:**
   ```bash
   docker-compose up --build -d
   ```

4. **Access the application:**
   - Frontend: http://localhost
   - Backend API: http://localhost:5000/api

## Services

| Service | Port | Description |
|---------|------|-------------|
| client | 80 | Nginx serving React static build |
| server | 5000 | Node.js Express API |
| mongodb | 27017 | MongoDB database |

## Environment Files

| File | Purpose |
|------|---------|
| `server/.env.example` | Template for local development |
| `server/.env.docker` | Template for Docker deployment |
| `client/.env.docker` | Template for Docker deployment |

## Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build -d

# Remove volumes (reset database)
docker-compose down -v

# Remove all including volumes and images
docker-compose down -v --rmi all
```

## Production Notes

1. **JWT Secrets**: Change to strong random secrets (minimum 32 characters)
2. **MongoDB**: For production, use managed MongoDB Atlas instead of local
3. **SSL/TLS**: Add reverse proxy (Traefik, Caddy) for HTTPS
4. **CLIENT_ORIGIN**: Update to your actual domain in production

## Troubleshooting

```bash
# Check container status
docker-compose ps

# Check logs for specific service
docker-compose logs server
docker-compose logs client
docker-compose logs mongodb

# Restart a specific service
docker-compose restart server

# Rebuild without cache
docker-compose build --no-cache
```