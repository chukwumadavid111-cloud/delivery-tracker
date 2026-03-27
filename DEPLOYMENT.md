# Deployment Guide

## Quick Deploy with Docker

### Locally
```bash
docker-compose up --build
curl http://localhost:4000
```

### Push to Docker Hub
```bash
docker build -t yourusername/delivery-tracker .
docker tag yourusername/delivery-tracker yourusername/delivery-tracker:latest
docker login
docker push yourusername/delivery-tracker
```

### Others use it
```bash
docker run -p 4000:4000 yourusername/delivery-tracker:latest
```

---

## Deploy to Cloud Platforms

### 1. Railway.app
```bash
# Create account at railway.app
railway login
railway init
railway deploy
# Get public URL
railway open
```

### 2. Render.com
1. Push repo to GitHub
2. Create new Web Service on Render
3. Connect GitHub repo
4. Render auto-deploys on push

### 3. DigitalOcean App Platform
1. GitHub repo
2. Create App
3. Select Dockerfile
4. Deploy

### 4. AWS ECS / EC2
```bash
# Build image
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker build -t my-app .
docker tag my-app:latest <account>.dkr.ecr.us-east-1.amazonaws.com/my-app:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/my-app:latest
```

### 5. Heroku (Legacy)
```bash
heroku login
heroku container:login
heroku create my-tracker
heroku container:push web
heroku container:release web
heroku open
```

---

## Environment Variables for Production

Create `.env.production` in backend:
```
NODE_ENV=production
PORT=4000
DATABASE_URL=postgres://user:pass@host:5432/db  # Optional: upgrade from SQLite
```

---

## Monitoring

```bash
# Check logs
docker logs <container-id>

# Monitor resources
docker stats

# Access database
sqlite3 backend/db.sqlite
> SELECT * FROM deliveries;
```

---

## Backup Database

```bash
# Before deploying
cp backend/db.sqlite db.backup.sqlite

# Restore if needed
cp db.backup.sqlite backend/db.sqlite
```

---

## SSL/HTTPS

For production use nginx or reverse proxy:
```nginx
server {
    listen 443 ssl;
    server_name delivery-tracker.com;
    
    ssl_certificate /etc/ssl/cert.pem;
    ssl_certificate_key /etc/ssl/key.pem;
    
    location / {
        proxy_pass http://localhost:4000;
    }
}
```

---

## Scale & Optimize

- Add caching: Redis
- Database: Upgrade to PostgreSQL
- Frontend: Deploy to CDN (Cloudflare)
- Load balancer: Use Nginx or cloud LB
- PM2: Multi-process manager for Node.js
