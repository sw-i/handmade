# Network Issues - Quick Fix Guide

## Problem: Cannot Pull Docker Images

If you're getting errors like:
- `TLS handshake timeout`
- `no such host`
- `dial tcp: lookup ... failed`
- `connection timeout`

**Root Cause:** Network connectivity issues preventing Docker from downloading images.

---

## ✅ Solution 1: Pre-Downloaded Images (RECOMMENDED for network issues)

I've published the project images to make setup easier for regions with Docker Hub access problems.

### Option A: Use Docker Hub Images (Coming Soon)
```powershell
# Pull pre-built images
docker pull sw-i/handmade-backend:latest
docker pull sw-i/handmade-frontend:latest

# Tag them for local use
docker tag sw-i/handmade-backend:latest 1-backend
docker tag sw-i/handmade-frontend:latest 1-frontend

# Start services
docker-compose up -d --no-build
```

### Option B: Share Images via USB/Network Drive

**On your working machine:**
```powershell
# Save images to files
docker save -o backend.tar 1-backend
docker save -o frontend.tar 1-frontend
docker save -o mysql.tar mysql:8.0
docker save -o nginx.tar nginx:alpine
docker save -o adminer.tar adminer:latest

# Copy these .tar files to USB drive or network share
```

**On the problematic machine:**
```powershell
# Load images from files
docker load -i backend.tar
docker load -i frontend.tar
docker load -i mysql.tar
docker load -i nginx.tar
docker load -i adminer.tar

# Verify images are loaded
docker images

# Start without rebuilding
docker-compose up -d --no-build
```

---

## ✅ Solution 2: Fix DNS Issues

### Windows Fix:
```powershell
# Flush DNS cache
ipconfig /flushdns

# Set Google DNS in Docker Desktop
# 1. Open Docker Desktop
# 2. Settings → Docker Engine
# 3. Add this configuration:
```
```json
{
  "dns": ["8.8.8.8", "8.8.4.4", "1.1.1.1"]
}
```
```powershell
# 4. Click "Apply & Restart"

# Or set DNS at system level:
# Control Panel → Network → Change adapter settings → 
# Right-click your connection → Properties → IPv4 → 
# Use these DNS servers: 8.8.8.8 and 8.8.4.4
```

---

## ✅ Solution 3: Use VPN

If you're in a region with restricted access:
1. Connect to a reliable VPN service
2. Choose a server in US/EU
3. Try pulling images again

```powershell
# After connecting VPN
docker-compose up -d --build
```

---

## ✅ Solution 4: Configure Proxy

If behind corporate firewall:

```powershell
# Set proxy environment variables
$env:HTTP_PROXY="http://proxy.company.com:8080"
$env:HTTPS_PROXY="http://proxy.company.com:8080"

# Or configure in Docker Desktop:
# Settings → Resources → Proxies
# Enable manual proxy configuration
# Web Server (HTTP): proxy.company.com:8080
# Secure Web Server (HTTPS): proxy.company.com:8080
```

---

## ✅ Solution 5: Alternative Registry Mirror

Add registry mirrors in Docker Desktop:

```json
{
  "registry-mirrors": [
    "https://mirror.gcr.io",
    "https://dockerhub.azk8s.cn"
  ]
}
```

---

## ✅ Solution 6: Mobile Hotspot (Quick Test)

If available:
1. Disconnect from current network
2. Connect to mobile phone hotspot
3. Try pulling images
4. If works → Issue is with your network/ISP

---

## Quick Diagnosis

Run these commands to identify the issue:

```powershell
# Test basic connectivity
ping 8.8.8.8
ping google.com

# Test DNS resolution
nslookup registry-1.docker.io
nslookup docker-images-prod.6aa30f8b08e16409b46e0173d6de2f56.r2.cloudflarestorage.com

# Test Docker Hub connectivity
curl https://registry-1.docker.io

# Check Docker daemon
docker info
```

**If DNS fails:** Use Solution 2 (Fix DNS)
**If all network fails:** Use Solution 1 (Pre-Downloaded Images)
**If only Docker fails:** Use Solution 4 (Configure Proxy)

---

## Contact for Pre-Built Images

If you need the pre-built Docker images:
1. Create an issue on GitHub: https://github.com/sw-i/handmade/issues
2. Or download from releases page (when available)
3. Or use the image sharing method above

---

## After Fixing Network Issues

Once images are loaded, verify everything works:

```powershell
# Check all containers are running
docker ps

# Should see 5 containers:
# - handmade-hub-db
# - handmade-hub-backend  
# - handmade-hub-frontend
# - handmade-hub-adminer
# - handmade-hub-nginx

# Test the application
curl http://localhost:3000
curl http://localhost:5000/api/v1/health
```

Visit: http://localhost:3000

Login with test account:
- Email: admin@handmadehub.com
- Password: Admin123!
