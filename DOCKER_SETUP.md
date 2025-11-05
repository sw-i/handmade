# 🚀 Quick Start Guide for Developers

This guide will help you run the Handmade Hub project using Docker on any machine.

> **⚠️ Having Issues?** See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed solutions to common problems.

## Prerequisites

- Docker Desktop installed (includes Docker Compose)
- Git (to clone the repository)
- 8GB RAM minimum
- 10GB free disk space

## 🎯 Running the Project (First Time)

### Step 1: Clone the Repository

```bash
git clone https://github.com/sw-i/handmade.git
cd handmade
```

### Step 2: Create Environment File

Copy the example environment file and configure it:

```bash
# Windows PowerShell
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

**Important:** Edit `.env` and update these values:
- `JWT_SECRET` - Generate a secure random string (32+ characters)
- `JWT_REFRESH_SECRET` - Generate another secure random string
- `STRIPE_SECRET_KEY` - Add your Stripe test key (or leave as placeholder for testing)
- `GEMINI_API_KEY` - Add your Google AI API key (or leave as placeholder)

### Step 3: Start the Application

```bash
docker-compose up -d
```

This will:
1. Pull MySQL 8.0 image
2. Build backend (Node.js/Express)
3. Build frontend (React/Vite)
4. Start all services
5. Initialize database with schema
6. Seed test data

**⏱️ First run takes 5-10 minutes** (downloads images, builds containers, initializes database)

### Step 4: Verify Installation

Wait 1-2 minutes for all services to be healthy, then check:

```bash
# Check all containers are running
docker-compose ps

# Check logs if any issues
docker-compose logs backend
docker-compose logs mysql
```

Access the application:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api/v1/health
- **Database Admin (Adminer):** http://localhost:8080

## 🔐 Test Accounts

The database is automatically seeded with these accounts:

### Admin Account
- Email: `admin@handmadehub.com`
- Password: `Admin123!`
- Access: Full platform administration

### Approved Vendor
- Email: `vendor@test.com`
- Password: `Test123!`
- Access: Vendor dashboard, product management

### Customer Account
- Email: `customer@test.com`
- Password: `Test123!`
- Access: Shopping, orders, reviews

### Pending Vendor (for testing approval workflow)
- Email: `pending@test.com`
- Password: `Test123!`
- Status: Awaiting admin approval

## 🛠️ Common Commands

### Start services
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Restart a service
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Rebuild after code changes
```bash
# Rebuild specific service
docker-compose up -d --build backend

# Rebuild all services
docker-compose up -d --build
```

### Clean installation (reset everything)
```bash
# Stop and remove all containers, networks, volumes
docker-compose down -v

# Start fresh
docker-compose up -d
```

## 🐛 Troubleshooting

### Backend shows "Unable to connect to database"

**Solution:**
```bash
# Check MySQL is healthy
docker-compose ps

# Wait for MySQL to be ready (check logs)
docker-compose logs mysql

# Restart backend after MySQL is ready
docker-compose restart backend
```

### Port already in use (3000, 5000, or 3306)

**Solution:**
```bash
# Windows: Find and kill process using port
netstat -ano | findstr :3000
taskkill /PID <process_id> /F

# Or change port in docker-compose.yml:
# ports:
#   - "3001:3000"  # Use 3001 instead of 3000
```

### Database tables not created

**Solution:**
```bash
# Remove volume and recreate
docker-compose down -v
docker-compose up -d

# Or manually run schema
docker exec -i handmade-hub-db mysql -uhandmade_user -phandmade_password123 handmade_hub < database/schema.sql
```

### Frontend shows white screen or errors

**Solution:**
```bash
# Rebuild frontend
docker-compose up -d --build frontend

# Check frontend logs
docker-compose logs frontend
```

### Backend crashes on startup

**Solution:**
```bash
# Check backend logs for specific error
docker-compose logs backend

# Common issues:
# 1. Missing environment variables - check .env file
# 2. Database not ready - wait 30 seconds and check again
# 3. Port conflict - change port in docker-compose.yml
```

## 📊 Database Management

### Access MySQL directly
```bash
# Via Docker exec
docker exec -it handmade-hub-db mysql -uhandmade_user -phandmade_password123 handmade_hub

# Or use Adminer web interface
# Visit: http://localhost:8080
# System: MySQL
# Server: mysql
# Username: handmade_user
# Password: handmade_password123
# Database: handmade_hub
```

### Backup database
```bash
docker exec handmade-hub-db mysqldump -uhandmade_user -phandmade_password123 handmade_hub > backup.sql
```

### Restore database
```bash
docker exec -i handmade-hub-db mysql -uhandmade_user -phandmade_password123 handmade_hub < backup.sql
```

## 🎨 Development Workflow

### Making Backend Changes

1. Edit files in `backend/src/`
2. Rebuild and restart:
```bash
docker-compose up -d --build backend
```

### Making Frontend Changes

1. Edit files in `frontend/src/`
2. Rebuild and restart:
```bash
docker-compose up -d --build frontend
```

### Database Schema Changes

1. Edit `database/schema.sql`
2. Reset database:
```bash
docker-compose down -v
docker-compose up -d
```

## 📝 Project Structure

```
handmade-hub/
├── backend/              # Node.js/Express API
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── models/       # Sequelize models
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth, validation, etc.
│   │   └── utils/        # Helper functions
│   ├── Dockerfile
│   └── package.json
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── store/        # State management
│   ├── Dockerfile
│   └── package.json
├── database/
│   └── schema.sql        # Database schema
├── docker-compose.yml    # Docker orchestration
└── .env                  # Environment variables
```

## 🔒 Security Notes

- Never commit `.env` file to Git (it's in .gitignore)
- Change default passwords before production
- Generate strong JWT secrets (32+ characters)
- Use real Stripe keys only in production
- Keep API keys secure

## 📚 API Documentation

API documentation is available at:
- Swagger UI: http://localhost:5000/api/v1/docs (if configured)
- See `docs/API.md` for detailed endpoint documentation

## 🆘 Getting Help

If you encounter issues:

1. Check this troubleshooting guide
2. Review container logs: `docker-compose logs`
3. Check GitHub Issues: https://github.com/sw-i/handmade/issues
4. Verify Docker Desktop is running
5. Ensure you have latest Docker version

## ✅ Health Checks

To verify everything is working:

```bash
# Check all services
curl http://localhost:3000                    # Frontend
curl http://localhost:5000/api/v1/health      # Backend
curl http://localhost:8080                    # Adminer

# Check database connectivity
docker exec handmade-hub-db mysql -uhandmade_user -phandmade_password123 -e "SELECT 1"
```

## 🎉 Success!

If all services are running and accessible, you're ready to develop or present!

Visit http://localhost:3000 and login with test accounts.
