# Getting Started with Handmade Hub

This guide will help you set up the Handmade Hub platform on your local machine for development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MySQL** (v8.0 or higher)
- **Git**
- **Docker & Docker Compose** (optional, for containerized development)

### Verify Prerequisites

```bash
node --version    # Should be v18+
npm --version     # Should be v9+
mysql --version   # Should be 8.0+
docker --version  # Optional
```

## Quick Start (5 Minutes)

### Option 1: Docker Compose (Recommended)

The fastest way to get everything running:

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/handmade-hub.git
cd handmade-hub

# 2. Start all services
docker-compose up -d

# 3. Wait for services to be ready (30-60 seconds)
docker-compose logs -f

# 4. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# MySQL: localhost:3306
```

That's it! Skip to the "Default Credentials" section below.

### Option 2: Manual Setup

If you prefer to run services individually:

#### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/handmade-hub.git
cd handmade-hub
```

#### Step 2: Setup Database

```bash
# Start MySQL (if not running)
# Windows: Start from Services
# Mac: brew services start mysql
# Linux: sudo systemctl start mysql

# Create database and import schema
mysql -u root -p
```

In MySQL prompt:

```sql
CREATE DATABASE handmade_hub;
exit;
```

Import the schema:

```bash
mysql -u root -p handmade_hub < database/schema.sql
```

#### Step 3: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration
# Use a text editor or:
notepad .env  # Windows
nano .env     # Mac/Linux
```

**Required .env variables:**

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=handmade_hub
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Secrets (generate random strings)
JWT_SECRET=your_long_random_secret_key_min_32_chars
JWT_REFRESH_SECRET=another_long_random_secret_key

# Stripe (use test keys)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key

# Email (optional for development)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_user
SMTP_PASSWORD=your_mailtrap_password
FROM_EMAIL=noreply@handmadehub.com
```

Start the backend:

```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

#### Step 4: Setup Frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file
notepad .env  # Windows
nano .env     # Mac/Linux
```

**Frontend .env:**

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at: `http://localhost:3000`

## Default Credentials

The database schema includes a default admin user:

```
Email: admin@handmadehub.com
Password: Admin123!
```

**⚠️ Important:** Change this password immediately in production!

## Verify Installation

### 1. Check Backend Health

```bash
curl http://localhost:5000/api/v1/health
```

Expected response:

```json
{
  "success": true,
  "message": "API is running"
}
```

### 2. Test Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@handmadehub.com",
    "password": "Admin123!"
  }'
```

You should receive a JWT token.

### 3. Access Frontend

Open `http://localhost:3000` in your browser. You should see the homepage.

## Development Workflow

### Backend Development

```bash
cd backend

# Start dev server with hot reload
npm run dev

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run linter
npm run lint

# Check code quality
npm run lint -- --fix
```

### Frontend Development

```bash
cd frontend

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Testing the Platform

### 1. Register as a Customer

1. Go to `http://localhost:3000/register`
2. Fill in the form with role "Customer"
3. Check email verification (if configured)
4. Login and access customer dashboard

### 2. Register as a Vendor

1. Go to `http://localhost:3000/register`
2. Fill in the form with role "Vendor"
3. Login as admin to approve the vendor
4. Access vendor dashboard after approval

### 3. Admin Functions

1. Login as admin (admin@handmadehub.com / Admin123!)
2. Go to `/admin` to access admin dashboard
3. Approve pending vendors
4. View platform analytics

### 4. Create Products (Vendor)

1. Login as a vendor
2. Go to `/vendor/products`
3. Click "Add Product"
4. Fill in product details
5. Upload product images

### 5. Place an Order (Customer)

1. Login as a customer
2. Browse products at `/products`
3. Add items to cart
4. Go to checkout at `/checkout`
5. Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC

## Common Issues & Solutions

### Issue: Database Connection Failed

**Solution:**

```bash
# Check MySQL is running
# Windows
sc query MySQL80

# Mac
brew services list

# Linux
sudo systemctl status mysql

# Verify credentials in backend/.env
# Try connecting manually
mysql -u root -p -h localhost
```

### Issue: Port Already in Use

**Solution:**

```bash
# Find process using port 5000 (backend)
# Windows
netstat -ano | findstr :5000

# Mac/Linux
lsof -ti:5000

# Kill the process or change port in backend/.env
PORT=5001
```

### Issue: npm Install Fails

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use npm ci for clean install
npm ci
```

### Issue: Frontend Can't Connect to Backend

**Solution:**

1. Verify backend is running: `http://localhost:5000/api/v1/health`
2. Check CORS settings in `backend/src/app.js`
3. Verify `VITE_API_URL` in `frontend/.env`
4. Clear browser cache and restart frontend

### Issue: JWT Token Expired

**Solution:**

1. Logout and login again
2. Check `JWT_EXPIRE` in backend `.env`
3. Clear cookies in browser

## Environment Configuration

### Backend Environment Variables

See `backend/.env.example` for complete list. Key variables:

- `NODE_ENV` - development | production
- `PORT` - API port (default: 5000)
- `DB_*` - Database connection
- `JWT_SECRET` - Token signing secret
- `STRIPE_SECRET_KEY` - Stripe API key
- `SMTP_*` - Email configuration
- `RATE_LIMIT_*` - Rate limiting settings

### Frontend Environment Variables

See `frontend/.env.example` for complete list. Key variables:

- `VITE_API_URL` - Backend API URL
- `VITE_STRIPE_PUBLIC_KEY` - Stripe public key
- `VITE_APP_NAME` - Application name

## Database Management

### Reset Database

```bash
# Drop and recreate
mysql -u root -p
```

```sql
DROP DATABASE IF EXISTS handmade_hub;
CREATE DATABASE handmade_hub;
exit;
```

```bash
# Re-import schema
mysql -u root -p handmade_hub < database/schema.sql
```

### Backup Database

```bash
mysqldump -u root -p handmade_hub > backup_$(date +%Y%m%d).sql
```

### Restore Database

```bash
mysql -u root -p handmade_hub < backup_20240101.sql
```

## Development Tools

### Recommended VSCode Extensions

- ESLint
- Prettier
- Docker
- REST Client
- MySQL
- Tailwind CSS IntelliSense

### Useful Commands

```bash
# View logs
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev

# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Database access
docker-compose exec mysql mysql -u root -p handmade_hub
```

## Next Steps

1. **Read the Documentation**
   - [Architecture Guide](./docs/README.md)
   - [API Reference](./docs/API.md)
   - [Deployment Guide](./docs/DEPLOYMENT.md)

2. **Explore the Code**
   - Backend controllers in `backend/src/controllers/`
   - API routes in `backend/src/routes/`
   - Frontend pages in `frontend/src/pages/`
   - React components in `frontend/src/components/`

3. **Run Tests**
   ```bash
   cd backend
   npm test
   ```

4. **Implement Frontend UI**
   - See stub files in `frontend/src/pages/`
   - Follow component structure in `frontend/src/components/`
   - Use Tailwind CSS utilities

5. **Configure Stripe**
   - Get test API keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
   - Add to `.env` files
   - Test payment flow

## Getting Help

- **Documentation**: Check `docs/` folder
- **API Reference**: See `docs/API.md`
- **Issues**: Open an issue on GitHub
- **Email**: support@handmadehub.com

## Tips for Success

1. ✅ Always run backend and frontend in separate terminals
2. ✅ Check both terminals for error messages
3. ✅ Use browser DevTools Network tab to debug API calls
4. ✅ Test with different user roles (customer, vendor, admin)
5. ✅ Keep environment variables synchronized
6. ✅ Commit changes frequently
7. ✅ Write tests for new features
8. ✅ Follow the existing code structure

## Ready to Code!

You're all set! The platform should now be running locally. Start by:

1. Exploring the admin dashboard
2. Creating test products as a vendor
3. Placing test orders as a customer
4. Implementing frontend UI components

**Happy Coding! 🚀**
