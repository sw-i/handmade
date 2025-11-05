# Troubleshooting Guide

## Common Issues and Solutions

### 1. Docker Image Pull Timeout (TLS Handshake Timeout)

**Error:**
```
Error response from daemon: failed to resolve reference "docker.io/library/nginx:alpine": 
failed to do request: Head "https://registry-1.docker.io/v2/library/nginx/manifests/alpine": 
net/http: TLS handshake timeout
```

**Cause:** Network connectivity issues, firewall blocking Docker Hub, or DNS problems.

**Solutions:**

#### Option A: Check Internet Connection
```powershell
# Test connectivity to Docker Hub
curl https://registry-1.docker.io

# Test DNS resolution
nslookup registry-1.docker.io
```

#### Option B: Configure Docker DNS
1. Open Docker Desktop
2. Go to Settings → Docker Engine
3. Add custom DNS servers:
```json
{
  "dns": ["8.8.8.8", "8.8.4.4"]
}
```
4. Click "Apply & Restart"

#### Option C: Use Docker Mirror (for regions with restricted access)
1. Open Docker Desktop → Settings → Docker Engine
2. Add a registry mirror:
```json
{
  "registry-mirrors": ["https://mirror.gcr.io"]
}
```
3. Click "Apply & Restart"

#### Option D: Configure Proxy (if behind corporate firewall)
```powershell
# Set environment variables
$env:HTTP_PROXY="http://proxy.example.com:8080"
$env:HTTPS_PROXY="http://proxy.example.com:8080"
$env:NO_PROXY="localhost,127.0.0.1"
```

Or in Docker Desktop → Settings → Resources → Proxies

#### Option E: Pre-pull Images Manually
```powershell
# Pull images one by one with retry
docker pull mysql:8.0
docker pull node:18-alpine
docker pull nginx:alpine
docker pull adminer:latest

# Then start services
docker-compose up -d --no-build
```

#### Option F: Increase Docker Pull Timeout
```powershell
# Edit Docker daemon config
# Windows: %USERPROFILE%\.docker\daemon.json
# Add:
{
  "max-concurrent-downloads": 3,
  "max-download-attempts": 5
}
```

---

### 2. Port Already in Use

**Error:**
```
Error starting userland proxy: listen tcp 0.0.0.0:3000: bind: address already in use
```

**Solution:**
```powershell
# Find process using the port
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change port in docker-compose.yml
# Change: "3000:80" to "3001:80"
```

---

### 3. Database Connection Failed

**Error:** Backend logs show "Unable to connect to database"

**Solutions:**

#### Check if MySQL is ready
```powershell
# Check MySQL container status
docker ps | findstr mysql

# Check MySQL logs
docker logs handmade-hub-db

# Wait for healthcheck
docker inspect handmade-hub-db | findstr -i health
```

#### Verify credentials
Check `.env` file matches docker-compose.yml settings

#### Manual connection test
```powershell
docker exec -it handmade-hub-db mysql -uhandmade_user -phandmade_password123 -Dhandmade_hub
```

---

### 4. Volume Permission Issues (Linux/Mac)

**Error:** Permission denied when accessing volumes

**Solution:**
```bash
# Fix permissions on Unix-based systems
sudo chown -R $USER:$USER ./mysql_data
chmod -R 755 ./mysql_data
```

---

### 5. Out of Disk Space

**Error:** "no space left on device"

**Solution:**
```powershell
# Clean up Docker system
docker system prune -a --volumes

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune
```

---

### 6. Container Keeps Restarting

**Check logs:**
```powershell
# View container logs
docker logs handmade-hub-backend --tail 100

# Follow logs in real-time
docker logs -f handmade-hub-backend
```

**Common causes:**
- Application crash on startup
- Missing environment variables
- Database not ready
- Port conflicts

---

### 7. Slow Build Times

**Solutions:**
```powershell
# Use BuildKit for faster builds
$env:DOCKER_BUILDKIT=1
docker-compose build

# Build without cache
docker-compose build --no-cache

# Parallel builds
docker-compose build --parallel
```

---

### 8. Windows-Specific Issues

#### WSL 2 Backend Issues
```powershell
# Check WSL version
wsl --list --verbose

# Update WSL
wsl --update

# Restart WSL
wsl --shutdown
```

#### Docker Desktop Not Starting
1. Restart Docker Desktop as Administrator
2. Check Windows Services: Docker Desktop Service should be running
3. Reinstall Docker Desktop if necessary

---

### 9. Cannot Access Application in Browser

**Check:**
```powershell
# Verify containers are running
docker ps

# Test backend health
curl http://localhost:5000/api/v1/health

# Test frontend
curl http://localhost:3000
```

**Solutions:**
- Clear browser cache
- Try different browser
- Check firewall settings
- Verify port mappings: `docker ps`

---

### 10. Database Schema Not Applied

**Symptoms:** Tables don't exist, backend crashes

**Solution:**
```powershell
# Check if schema was executed
docker logs handmade-hub-db | findstr -i "schema"

# Manually apply schema
docker exec -i handmade-hub-db mysql -uroot -prootpassword123 handmade_hub < database/schema.sql

# Verify tables exist
docker exec handmade-hub-db mysql -uhandmade_user -phandmade_password123 -Dhandmade_hub -e "SHOW TABLES;"
```

---

## Network-Specific Troubleshooting

### For Regions with Docker Hub Access Issues

If you're in a region where Docker Hub is slow or blocked:

1. **Use a VPN** - Connect to a VPN server in a different region
2. **Use Mirror Registry** - Configure Docker to use a mirror
3. **Download from GitHub** - Some projects provide pre-built images
4. **Build Locally** - Use Dockerfiles to build from source without pulling base images from Docker Hub

### Corporate Networks

If behind a corporate firewall:

1. Contact IT for proxy settings
2. Add Docker Hub to firewall whitelist
3. Use internal Docker registry if available
4. Request port 443 (HTTPS) access to:
   - `registry-1.docker.io`
   - `auth.docker.io`
   - `production.cloudflare.docker.com`

---

## Getting Help

If issues persist:

1. **Check Docker Status:**
   ```powershell
   docker info
   docker version
   ```

2. **Collect Logs:**
   ```powershell
   docker-compose logs > docker-logs.txt
   ```

3. **System Info:**
   ```powershell
   # Windows
   systeminfo | findstr /C:"OS"
   
   # Docker Desktop
   # Help → Troubleshoot → Get Support
   ```

4. **Create GitHub Issue:**
   - Include error messages
   - Include `docker info` output
   - Include OS and Docker version
   - Include steps to reproduce

---

## Quick Health Check

Run this to verify everything is working:

```powershell
# All containers should be running
docker ps

# Database should have 10 tables
docker exec handmade-hub-db mysql -uhandmade_user -phandmade_password123 -Dhandmade_hub -e "SHOW TABLES;"

# Backend health check
curl http://localhost:5000/api/v1/health

# Frontend accessible
curl http://localhost:3000

# Check disk space
docker system df
```

---

## Prevention Tips

1. **Keep Docker Updated:** Regularly update Docker Desktop
2. **Monitor Resources:** Check CPU, RAM, and disk usage
3. **Regular Cleanup:** Run `docker system prune` monthly
4. **Backup Data:** Export database before major changes
5. **Use .dockerignore:** Prevent large files from being included in builds
6. **Version Control:** Commit working configurations to Git
