# Handmade Hub - Production SaaS Platform

## 🎯 Overview

Handmade Hub is a complete, production-ready full-stack SaaS platform designed for home-based entrepreneurs and artisan communities. The platform provides a comprehensive marketplace solution with vendor management, product listings, order processing, secure payments, and analytics.

## 🏗️ System Architecture

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT TIER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Customer   │  │    Vendor    │  │    Admin     │     │
│  │   Frontend   │  │   Dashboard  │  │    Panel     │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          └──────────────────┴──────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────┐
│                     API GATEWAY TIER                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  NGINX Reverse Proxy / Load Balancer                │   │
│  │  • SSL Termination                                   │   │
│  │  • Rate Limiting                                     │   │
│  │  • Request Routing                                   │   │
│  └──────────────────────┬───────────────────────────────┘   │
└─────────────────────────┼───────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                 APPLICATION TIER                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Node.js / Express Backend                          │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │   │
│  │  │    Auth     │  │   Product   │  │    Order    │ │   │
│  │  │   Service   │  │   Service   │  │   Service   │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘ │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │   │
│  │  │   Vendor    │  │   Review    │  │  Analytics  │ │   │
│  │  │   Service   │  │   Service   │  │   Service   │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘ │   │
│  └──────────────────────┬───────────────────────────────┘   │
└─────────────────────────┼───────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                    DATA TIER                                 │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │  MySQL         │  │  File Storage  │  │   Redis      │  │
│  │  Database      │  │  (AWS S3)      │  │   Cache      │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
└──────────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────┐
│              EXTERNAL SERVICES                               │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │  Stripe        │  │  SendGrid/SMTP │  │  Monitoring  │  │
│  │  Payments      │  │  Email         │  │  (DataDog)   │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **ORM**: Sequelize 6.x
- **Database**: MySQL 8.0
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: express-validator, Joi
- **File Upload**: Multer, Sharp (image processing)
- **Payment**: Stripe
- **Email**: Nodemailer
- **Logging**: Winston
- **Security**: Helmet, CORS, XSS-Clean, HPP

#### Frontend
- **Framework**: React 18+
- **State Management**: Redux Toolkit / Context API
- **Routing**: React Router 6
- **HTTP Client**: Axios
- **UI Components**: Material-UI / Tailwind CSS
- **Forms**: React Hook Form + Yup validation
- **Charts**: Recharts / Chart.js

#### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions
- **Cloud**: AWS / Azure / Google Cloud
- **Monitoring**: Winston Logger
- **Testing**: Jest, Supertest

## 📁 Project Structure

```
handmade-hub/
├── backend/                    # Node.js/Express backend
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   │   └── database.js    # Database connection
│   │   ├── controllers/       # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── orderController.js
│   │   │   ├── vendorController.js
│   │   │   └── reviewController.js
│   │   ├── middleware/        # Custom middleware
│   │   │   ├── auth.js        # Authentication
│   │   │   ├── errorHandler.js
│   │   │   ├── rateLimiter.js
│   │   │   ├── upload.js      # File upload
│   │   │   └── validator.js
│   │   ├── models/            # Database models (Sequelize)
│   │   │   ├── User.js
│   │   │   ├── Vendor.js
│   │   │   ├── Product.js
│   │   │   ├── Order.js
│   │   │   ├── OrderItem.js
│   │   │   ├── Review.js
│   │   │   └── index.js       # Model associations
│   │   ├── routes/            # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   ├── vendorRoutes.js
│   │   │   ├── reviewRoutes.js
│   │   │   └── index.js
│   │   ├── services/          # Business logic services
│   │   ├── utils/             # Utility functions
│   │   │   ├── helpers.js
│   │   │   ├── jwtHelper.js
│   │   │   └── logger.js
│   │   ├── app.js             # Express app setup
│   │   └── server.js          # Server entry point
│   ├── tests/                 # Test suites
│   │   ├── auth.test.js
│   │   └── setup.js
│   ├── uploads/               # Uploaded files (gitignored)
│   ├── logs/                  # Application logs (gitignored)
│   ├── .env.example           # Environment variables template
│   ├── .gitignore
│   ├── Dockerfile
│   ├── jest.config.js
│   └── package.json
├── frontend/                  # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service layer
│   │   ├── store/            # Redux store
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Utility functions
│   │   ├── App.js
│   │   └── index.js
│   ├── Dockerfile
│   └── package.json
├── database/                  # Database scripts
│   └── schema.sql            # Database schema
├── docs/                      # Documentation
│   ├── API.md                # API documentation
│   ├── DEPLOYMENT.md         # Deployment guide
│   └── DEVELOPMENT.md        # Development guide
├── .github/
│   └── workflows/
│       └── ci-cd.yml         # CI/CD pipeline
├── docker-compose.yml        # Docker composition
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MySQL 8.0+
- Docker and Docker Compose (optional)
- Stripe account (for payments)
- SendGrid account (for emails)

### Local Development Setup

#### 1. Clone the repository

```bash
git clone https://github.com/yourusername/handmade-hub.git
cd handmade-hub
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
# Required: DB credentials, JWT secrets, Stripe keys

# Create database
mysql -u root -p
CREATE DATABASE handmade_hub;
exit

# Run database migrations
mysql -u root -p handmade_hub < ../database/schema.sql

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api/v1" > .env

# Start development server
npm start
```

Frontend will run on `http://localhost:3000`

### Docker Setup (Recommended)

```bash
# Create .env file in root directory
cp backend/.env.example .env

# Edit .env with your configuration

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MySQL: localhost:3306

## 📖 API Documentation

### Base URL

```
Development: http://localhost:5000/api/v1
Production: https://api.handmadehub.com/api/v1
```

### Authentication

All protected endpoints require a JWT token:

```http
Authorization: Bearer <your-jwt-token>
```

### Core Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user
- `PUT /auth/updatedetails` - Update user details
- `PUT /auth/updatepassword` - Update password
- `POST /auth/forgotpassword` - Request password reset
- `PUT /auth/resetpassword/:token` - Reset password

#### Products
- `GET /products` - Get all products (public)
- `GET /products/:id` - Get single product (public)
- `POST /products` - Create product (vendor/admin)
- `PUT /products/:id` - Update product (vendor/admin)
- `DELETE /products/:id` - Delete product (vendor/admin)
- `POST /products/:id/images` - Upload product images (vendor/admin)

#### Orders
- `POST /orders` - Create order (customer)
- `GET /orders` - Get customer orders (customer)
- `GET /orders/:id` - Get order details (customer/vendor/admin)
- `PUT /orders/:id/status` - Update order status (vendor/admin)
- `GET /orders/vendor/me` - Get vendor orders (vendor)

#### Vendors
- `GET /vendors` - Get all vendors (public)
- `GET /vendors/:id` - Get vendor profile (public)
- `GET /vendors/me/profile` - Get own vendor profile (vendor)
- `PUT /vendors/me/profile` - Update vendor profile (vendor)
- `GET /vendors/me/analytics` - Get vendor analytics (vendor)
- `PUT /vendors/:id/approve` - Approve vendor (admin)
- `GET /vendors/admin/pending` - Get pending vendors (admin)

#### Reviews
- `GET /products/:productId/reviews` - Get product reviews (public)
- `POST /products/:productId/reviews` - Create review (customer)
- `PUT /reviews/:id` - Update review (customer)
- `DELETE /reviews/:id` - Delete review (customer/admin)
- `PUT /reviews/:id/respond` - Vendor response (vendor)

For detailed API documentation with request/response examples, see [docs/API.md](docs/API.md)

## 🔒 Security Features

### Implemented Security Measures

1. **Authentication & Authorization**
   - JWT-based authentication with refresh tokens
   - Role-based access control (Customer, Vendor, Admin)
   - Password hashing with bcrypt (12 rounds)
   - Email verification for new accounts
   - Secure password reset flow

2. **Data Protection**
   - SQL injection prevention (Sequelize ORM)
   - XSS protection (xss-clean middleware)
   - CSRF protection (tokens)
   - Data sanitization (express-mongo-sanitize)
   - Parameter pollution prevention (hpp)

3. **Network Security**
   - HTTPS enforcement
   - Helmet.js security headers
   - CORS configuration
   - Rate limiting (100 req/15min general, 5 req/15min auth)
   - HTTPOnly, Secure cookies

4. **Payment Security**
   - Stripe PCI DSS compliance
   - No storage of card details
   - Tokenized payments
   - Webhook signature verification

5. **GDPR Compliance**
   - Data minimization
   - User consent tracking
   - Right to erasure implementation
   - Data portability support
   - Privacy policy enforcement

## 🧪 Testing

### Running Tests

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test auth.test.js

# Watch mode
npm run test:watch
```

### Test Coverage Goals

- Unit Tests: 80%+ coverage
- Integration Tests: Key workflows covered
- E2E Tests: Critical user paths validated

## 🚢 Deployment

### AWS Deployment

1. **Setup EC2 Instance**
2. **Install Docker & Docker Compose**
3. **Configure Security Groups**
4. **Setup RDS for MySQL**
5. **Configure S3 for file storage**
6. **Setup CloudFront CDN**
7. **Configure Route 53 for DNS**

### Azure Deployment

1. **Create App Service**
2. **Setup Azure Database for MySQL**
3. **Configure Azure Blob Storage**
4. **Setup Azure CDN**
5. **Configure custom domain**

For detailed deployment instructions, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

## 📊 Monitoring & Logging

### Application Logging

Logs are stored in `backend/logs/`:
- `combined.log` - All logs
- `error.log` - Error logs only

### Health Check

```bash
curl http://localhost:5000/api/v1/health
```

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Code Standards

- ESLint for code linting
- Prettier for code formatting
- Conventional commits
- Test coverage required for new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: support@handmadehub.com
- Documentation: https://docs.handmadehub.com
- Issues: https://github.com/yourusername/handmade-hub/issues

## 🙏 Acknowledgments

- Built for home-based entrepreneurs and artisan communities
- Designed to support local economies and traditional crafts
- Implements modern security and compliance standards
- Production-ready SaaS architecture

---

**Note**: This is a production-ready platform. Ensure all environment variables are properly configured and security best practices are followed before deploying to production.
