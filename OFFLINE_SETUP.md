# 📦 Offline Docker Setup Guide

This guide explains how to run the Handmade Hub project on machines **without internet access** or with **network issues**.

## 🎯 Method 1: Share Docker Images (Recommended)

### On Your Machine (with working internet):

#### Step 1: Save Docker Images
```powershell
# Navigate to project directory
cd handmade

# Run the save script
.\save-docker-images.ps1
```

This will create a `docker-images` folder containing:
- `mysql-8.0.tar` (~150 MB)
- `node-18-alpine.tar` (~180 MB)
- `nginx-alpine.tar` (~40 MB)
- `adminer-latest.tar` (~90 MB)
- `handmade-backend.tar` (~200 MB)
- `handmade-frontend.tar` (~50 MB)

**Total size: ~700-800 MB**

#### Step 2: Copy to Target Machine

Copy these files to the target machine:
- The entire `docker-images` folder
- The entire project folder (or create a zip file)

**Via USB Drive:**
```powershell
# Copy project and images
Copy-Item -Path "handmade" -Destination "E:\handmade" -Recurse
```

**Via Network Share:**
```powershell
# Share folder
# \\YOUR-PC\shared\handmade
```

### On Target Machine (without internet):

#### Step 1: Extract Project
```powershell
# If using zip
Expand-Archive -Path "handmade.zip" -DestinationPath "C:\Projects"
cd C:\Projects\handmade
```

#### Step 2: Load Docker Images
```powershell
# Run the load script
.\load-docker-images.ps1
```

#### Step 3: Configure Environment
```powershell
# Copy environment file
Copy-Item .env.example .env

# Edit .env if needed (optional)
notepad .env
```

#### Step 4: Start Services
```powershell
# Start all containers (no internet needed!)
docker-compose up -d

# Check status
docker ps

# View logs
docker-compose logs -f
```

#### Step 5: Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Database Admin: http://localhost:8080

**Test Login:**
- Email: admin@handmadehub.com
- Password: Admin123!

---

## 🎯 Method 2: Pre-configured .env File

Include a ready-to-use `.env` file in your distribution:

```properties
# MySQL Database
MYSQL_ROOT_PASSWORD=rootpassword123
MYSQL_DATABASE=handmade_hub
MYSQL_USER=handmade_user
MYSQL_PASSWORD=handmade_password123

# Backend Application
NODE_ENV=production
PORT=5000

# Database Connection
DB_HOST=mysql
DB_PORT=3306
DB_NAME=handmade_hub
DB_USER=handmade_user
DB_PASSWORD=handmade_password123

# JWT Secrets (CHANGE IN PRODUCTION!)
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_characters
JWT_REFRESH_EXPIRE=30d
JWT_COOKIE_EXPIRE=7

# Stripe (use test keys or leave as-is)
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLIC_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# Email (optional)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_user
SMTP_PASSWORD=your_password
FROM_EMAIL=noreply@handmadehub.com
FROM_NAME=Handmade Hub

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
MAX_FILE_UPLOAD=5

# Platform Configuration
PLATFORM_COMMISSION_RATE=10

# AI (optional)
GEMINI_API_KEY=your_gemini_key
```

---

## 🎯 Method 3: Single ZIP Distribution

Create a complete package:

```powershell
# On your machine
.\save-docker-images.ps1

# Create complete package
Compress-Archive -Path @(
    "backend",
    "frontend",
    "database",
    "nginx",
    "docker-compose.yml",
    ".env.example",
    "load-docker-images.ps1",
    "docker-images",
    "README.md",
    "OFFLINE_SETUP.md"
) -DestinationPath "handmade-hub-complete.zip"
```

**Share:** `handmade-hub-complete.zip` (size: ~800 MB)

**On target machine:**
```powershell
# Extract
Expand-Archive -Path "handmade-hub-complete.zip" -DestinationPath "C:\handmade"
cd C:\handmade

# Load images
.\load-docker-images.ps1

# Setup environment
Copy-Item .env.example .env

# Start
docker-compose up -d
```

---

## 🎯 Method 4: Docker Hub (Online Alternative)

If target machine has limited internet but can access Docker Hub:

```powershell
# TODO: After publishing to Docker Hub
docker pull sw-i/handmade-backend:latest
docker pull sw-i/handmade-frontend:latest
docker-compose up -d
```

---

## 🔧 Troubleshooting Offline Setup

### Issue: Images not loading
```powershell
# Check if tar files exist
Get-ChildItem docker-images\*.tar

# Manually load specific image
docker load -i docker-images\mysql-8.0.tar

# Verify loaded
docker images
```

### Issue: Container fails to start
```powershell
# Check logs
docker logs handmade-hub-backend
docker logs handmade-hub-db

# Restart specific container
docker restart handmade-hub-backend

# Rebuild if needed (source code required)
docker-compose build backend
```

### Issue: Permission errors (Windows)
```powershell
# Run PowerShell as Administrator
# Right-click PowerShell → Run as Administrator

# Allow script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: Port conflicts
```powershell
# Check what's using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or change port in docker-compose.yml
# Edit ports: "3001:80" instead of "3000:80"
```

---

## 📝 Distribution Checklist

Before sharing with others:

- [ ] Run `save-docker-images.ps1` to export all images
- [ ] Include `.env.example` file
- [ ] Include all source code (backend, frontend, database)
- [ ] Include `docker-compose.yml`
- [ ] Include `load-docker-images.ps1`
- [ ] Include `README.md` and `OFFLINE_SETUP.md`
- [ ] Test on a clean machine
- [ ] Document any special requirements
- [ ] Include test account credentials

---

## 📊 System Requirements

**Minimum:**
- Docker Desktop 20.10+
- 8 GB RAM
- 10 GB free disk space
- Windows 10/11, macOS 10.15+, or Linux

**Recommended:**
- 16 GB RAM
- 20 GB free disk space
- SSD storage

---

## 🚀 Quick Start (Offline)

```powershell
# 1. Load images
.\load-docker-images.ps1

# 2. Setup environment
Copy-Item .env.example .env

# 3. Start services
docker-compose up -d

# 4. Wait 30-60 seconds for initialization

# 5. Check status
docker ps

# 6. Visit application
start http://localhost:3000
```

---

## 📞 Support

If you encounter issues:

1. Check `docker-compose logs`
2. Verify all images loaded: `docker images`
3. Check container status: `docker ps -a`
4. Review `TROUBLESHOOTING.md`
5. Create GitHub issue with error details

---

## ✅ Success Indicators

Everything is working when you see:

```powershell
docker ps
```

Output should show 5 containers running:
- handmade-hub-db (healthy)
- handmade-hub-backend (healthy)
- handmade-hub-frontend (healthy)
- handmade-hub-adminer (healthy)
- handmade-hub-nginx (optional)

Visit http://localhost:3000 - You should see the homepage! 🎉
