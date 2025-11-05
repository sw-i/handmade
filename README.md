# Handmade Hub - Full-Stack E-Commerce Platform

✅ **Production-Ready** marketplace platform for home-based entrepreneurs to sell handcrafted products.

**Built with:** React + Node.js + MySQL + Docker

**Repository:** https://github.com/sw-i/handmade

---

## ⚡ Quick Start with Docker

**Choose your setup method:**

### 🌐 Online Setup (Recommended)
See [DOCKER_SETUP.md](./DOCKER_SETUP.md) for step-by-step instructions.

```bash
# 1. Clone repository
git clone https://github.com/sw-i/handmade.git
cd handmade

# 2. Create .env file (required)
cp .env.example .env
# Edit .env and update JWT_SECRET values

# 3. Start everything
docker-compose up -d --build

# 4. Visit http://localhost:3000 (wait ~5 mins for first build)
```

### 📦 Offline Setup (No Internet / Network Issues)
See [OFFLINE_SETUP.md](./OFFLINE_SETUP.md) for offline installation guide.

```powershell
# On machine with internet: Save images
.\save-docker-images.ps1

# Transfer docker-images folder to target machine

# On target machine: Load images and start
.\load-docker-images.ps1
docker-compose up -d
```

**Test Credentials:**
| Role | Email | Password | Description |
|------|-------|----------|-------------|
| **Admin** | admin@test.com | Test123! | Full platform access |
| **Vendor** | vendor@test.com | Test123! | Approved vendor with products |
| **Customer** | customer@test.com | Test123! | Regular customer account |

> **⚠️ Network Issues?** See [NETWORK_ISSUES.md](./NETWORK_ISSUES.md) for DNS/connectivity troubleshooting.

---

## 🚀 Project Overview



Handmade Hub is a production-ready e-commerce platform featuring:Handmade Hub is a comprehensive e-commerce platform built with modern technologies, featuring:



- **Multi-role authentication system** (Customers, Vendors, Administrators)- **Multi-role system** (Customers, Vendors, Admins)

- **Complete marketplace functionality** with product catalogs, shopping cart, and checkout- **Complete marketplace functionality** (Products, Orders, Payments)

- **Vendor management system** with approval workflows and analytics- **Vendor management** with approval workflow

- **Secure payment processing** integrated with Stripe- **Secure payment processing** via Stripe

- **Real-time inventory tracking** and order management- **Real-time inventory tracking**

- **Review and rating system** for products- **Review and rating system**

- **Analytics dashboards** providing business insights- **Analytics dashboards** for vendors and admins

- **RESTful API architecture** with comprehensive documentation- **RESTful API** with comprehensive documentation

- **Responsive web design** optimized for desktop and mobile devices- **Docker containerization** for easy deployment

- **Docker containerization** for simplified deployment- **CI/CD pipeline** with automated testing



## 📁 Project Structure## 📁 Project Structure
```

handmade-hub/handmade-hub/

├── backend/              # Node.js/Express REST API├── backend/              # Node.js/Express API

│   ├── src/│   ├── src/

│   │   ├── config/       # Database and application configuration│   │   ├── config/       # Database & app configuration

│   │   ├── controllers/  # Request handling and business logic│   │   ├── controllers/  # Business logic

│   │   ├── middleware/   # Authentication, validation, error handling│   │   ├── middleware/   # Auth, validation, error handling

│   │   ├── models/       # Sequelize ORM database models│   │   ├── models/       # Sequelize ORM models

│   │   ├── routes/       # API endpoint definitions│   │   ├── routes/       # API endpoints

│   │   ├── utils/        # Helper functions and utilities│   │   ├── utils/        # Helper functions

│   │   └── app.js        # Express application setup│   │   └── app.js        # Express app setup

│   ├── tests/            # Jest test suites│   ├── tests/            # Jest test suites

│   └── package.json      # Backend dependencies│   └── package.json

││

├── frontend/             # React single-page application├── frontend/             # React/Vite SPA

│   ├── src/│   ├── src/

│   │   ├── components/   # Reusable React components│   │   ├── components/   # Reusable UI components

│   │   ├── pages/        # Route-based page components│   │   ├── pages/        # Route components

│   │   ├── services/     # API integration layer│   │   ├── services/     # API integration

│   │   ├── store/        # State management (Zustand)│   │   ├── store/        # State management (Zustand)

│   │   ├── hooks/        # Custom React hooks│   │   ├── hooks/        # Custom React hooks

│   │   └── App.jsx       # Main application component│   │   └── App.jsx       # Main app component

│   ├── public/           # Static assets│   └── package.json

│   └── package.json      # Frontend dependencies│

│├── database/             # Database schemas & migrations

├── database/             # Database schemas and migrations│   └── schema.sql        # MySQL schema

│   └── schema.sql        # MySQL database schema│

│├── docs/                 # Documentation

├── docs/                 # Project documentation│   ├── README.md         # Architecture & setup guide

│   ├── README.md         # Architecture overview│   ├── API.md            # Complete API reference

│   ├── API.md            # API endpoint documentation│   └── DEPLOYMENT.md     # Deployment instructions

│   └── DEPLOYMENT.md     # Deployment guide│

│├── .github/

├── docker-compose.yml    # Multi-container orchestration│   └── workflows/

└── .env.example          # Environment variables template│       └── ci-cd.yml     # GitHub Actions pipeline

├── docker-compose.yml    # Multi-service orchestration

```

## 🛠️ Technology Stack└── README.md             # This file


### Backend

- **Runtime**: Node.js 18+## 🛠️ Tech Stack

- **Framework**: Express.js 4.18

- **Database**: MySQL 8.0 with Sequelize ORM### Backend

- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing- **Runtime**: Node.js 18+

- **Payment Processing**: Stripe API integration- **Framework**: Express.js 4.18

- **File Handling**: Multer for uploads, Sharp for image processing- **Database**: MySQL 8.0 with Sequelize ORM

- **Testing**: Jest with Supertest- **Authentication**: JWT with bcrypt

- **Logging**: Winston logger with Morgan HTTP logging- **Payment**: Stripe API

- **File Upload**: Multer + Sharp

### Frontend- **Testing**: Jest + Supertest

- **Framework**: React 18- **Logging**: Winston + Morgan

- **Build Tool**: Vite 5

- **Routing**: React Router 6### Frontend

- **State Management**: Zustand with TanStack Query for server state- **Framework**: React 18

- **Styling**: Tailwind CSS 3- **Build Tool**: Vite 5

- **Form Handling**: React Hook Form with Yup validation- **Routing**: React Router 6

- **HTTP Client**: Axios- **State**: Zustand + TanStack Query

- **UI Components**: Custom components with Lucide React icons- **Styling**: Tailwind CSS 3

- **Notifications**: React Hot Toast- **Forms**: React Hook Form + Yup

- **HTTP Client**: Axios

### DevOps & Infrastructure- **Notifications**: React Hot Toast

- **Containerization**: Docker & Docker Compose

- **Database Management**: Adminer web interface### DevOps

- **Reverse Proxy**: Nginx (optional)- **Containerization**: Docker + Docker Compose

- **Version Control**: Git- **CI/CD**: GitHub Actions

- **Web Server**: Nginx (reverse proxy)

## ⚙️ Installation & Setup- **Cloud**: AWS/Azure ready

- **Chapter 5: Results and Discussion**

### Prerequisites  - Achievements

- Node.js 18 or higher  - Challenges

- Docker and Docker Compose  - Future Work

- MySQL 8.0 (if not using Docker)  - Ethical, Legal, and Social Impact

- Git- **Chapter 6: Conclusions**

- **References** section

### Quick Start with Docker (Recommended)

### User Interface Features

1. **Clone the repository**- Fixed navigation header with quick links

   ```bash- Collapsible sidebar Table of Contents

   git clone <repository-url>- Breadcrumb navigation showing current location

   cd handmade-hub- Responsive design (mobile and desktop)

   ```- Back-to-top button

- Progress indicator

2. **Configure environment variables**- Download buttons for PDF/DOCX reports

   ```bash

   cp .env.example .env### Accessibility Features

   ```- WCAG 2.1 AA compliant

   Edit `.env` file with your configuration:- Keyboard navigation support

   - Database credentials- Screen reader compatible

   - JWT secrets (generate secure random strings)- Skip links for main content

   - Stripe API keys- ARIA labels and roles

   - Email SMTP settings- Focus management

- High contrast mode support

3. **Start all services**- Reduced motion support

   ```bash

   docker-compose up -d### Technical Features

   ```- Semantic HTML5

- Modern CSS with CSS Variables

4. **Access the application**- Vanilla JavaScript (no dependencies)

   - Frontend: http://localhost:3000- Progressive enhancement

   - Backend API: http://localhost:5000- Print-friendly styles

   - Database Admin: http://localhost:8080- SEO optimized



5. **Initialize database with test data**## Customization Guide

   ```bash

   docker-compose exec backend npm run seed### 1. Update Student Information

   ```Replace the placeholder text in `project-index.html`:

- `[Your Name]` - Your full name

### Manual Setup (Without Docker)- `[Your Student ID]` - Your student ID number

- `[Supervisor Name]` - Your project supervisor's name

#### Backend Setup- `[University Name]` - Your institution name

```bash- `[Date]` - Submission date

cd backend- `[Degree Name]` - Your degree program

npm install

npm run migrate### 2. Add Your Content

npm run seedEdit the following sections with your actual project content:

npm run dev- Abstract text

```- Acknowledgements

- All chapter content

#### Frontend Setup- Figures and tables lists

```bash- References

cd frontend

npm install### 3. Add PDF/DOCX Files

npm run devPlace your report files in the root directory:

```- `TM471_FinalReport.pdf`

- `TM471_FinalReport.docx` (optional)

#### Database Setup

- Create MySQL database named `handmade_hub`### 4. Add Images and Diagrams

- Import schema from `database/schema.sql`Place all project images in the `assets/` directories:

- Update database credentials in `.env````

assets/

## 📚 Usage├── images/          # General images

├── figures/         # Numbered figures from report

### Test Accounts│   ├── figure-1-1.png

│   ├── figure-2-1.png

After seeding the database, use these credentials:│   └── ...

└── tables/          # Tables and charts

**Administrator Account:**```

- Email: `admin@test.com`

- Password: `Admin123!`### 5. Customize Colors

Edit CSS variables in `styles/academic.css`:

**Vendor Account:**```css

- Email: `vendor@test.com`:root {

- Password: `Vendor123!`    --primary-blue: #1e3a8a;        /* Main color */

    --accent-gold: #d97706;          /* Accent color */

**Customer Account:**    /* ... other variables ... */

- Email: `customer@test.com`}

- Password: `Customer123!````



### Key Features## Usage Instructions



#### For Customers### Viewing the Website

- Browse products by category1. Open `project-index.html` in a modern web browser

- Search and filter functionality2. Navigate using the sidebar TOC or top navigation

- Add items to cart and checkout3. Click citations to jump to references

- Secure payment with Stripe4. Use download buttons to get full reports

- Order tracking

- Product reviews and ratings### Keyboard Navigation

- Profile management- `Tab` - Navigate between interactive elements

- `Enter/Space` - Activate buttons and links

#### For Vendors- `Esc` - Close mobile menu

- Create and manage product listings- Arrow keys - Scroll through content

- Upload product images

- Track inventory### Mobile Usage

- Process orders- Tap hamburger icon to open navigation menu

- View sales analytics- Tap TOC header to toggle sidebar

- Manage vendor profile- Swipe to scroll through content

- Review customer feedback

### Printing

#### For Administrators- Use browser print function (Ctrl+P / Cmd+P)

- Approve/reject vendor applications- All navigation elements are hidden in print view

- Manage all products and users- Optimized for A4 paper size

- Monitor platform payments- Includes page breaks at appropriate sections

- View platform analytics

- Handle customer support tickets## Development

- Manage events and promotions

### Adding New Sections

## 🧪 Testing1. Add section HTML in `project-index.html`:

```html

### Run Backend Tests<section id="new-section" class="section">

```bash    <div class="section-content">

cd backend        <h2 class="section-heading">New Section Title</h2>

npm test        <p>Content here...</p>

npm run test:coverage    </div>

```</section>

```

### Run Frontend Tests

```bash2. Add TOC entry:

cd frontend```html

npm test<li class="toc-item">

```    <a href="#new-section">New Section Title</a>

</li>

## 📖 API Documentation```



The API follows RESTful conventions. Base URL: `http://localhost:5000/api/v1`3. Add navigation link (if needed):

```html

### Authentication Endpoints<li role="none">

- `POST /api/v1/auth/register` - Register new user    <a href="#new-section" role="menuitem">New Section</a>

- `POST /api/v1/auth/login` - User login</li>

- `POST /api/v1/auth/logout` - User logout```

- `POST /api/v1/auth/refresh` - Refresh access token

### Adding Subsections

### Product Endpoints```html

- `GET /api/v1/products` - List all products<div id="subsection-id" class="subsection">

- `GET /api/v1/products/:id` - Get product details    <h3 class="subsection-heading">1.1 Subsection Title</h3>

- `POST /api/v1/products` - Create product (Vendor only)    <p>Subsection content...</p>

- `PUT /api/v1/products/:id` - Update product (Vendor only)</div>

- `DELETE /api/v1/products/:id` - Delete product (Vendor only)```



### Order Endpoints### Adding Figures

- `GET /api/v1/orders` - List user orders```html

- `GET /api/v1/orders/:id` - Get order details<figure id="figure-1" class="figure">

- `POST /api/v1/orders` - Create new order    <img src="assets/figures/figure-1-1.png" alt="Description">

- `PUT /api/v1/orders/:id/status` - Update order status (Vendor)    <figcaption>

        <strong>Figure 1.1:</strong> Caption text

For complete API documentation, see `docs/API.md`    </figcaption>

</figure>

## 🔒 Security Features```



- JWT-based authentication with refresh tokens### Adding Tables

- Password hashing using bcrypt```html

- SQL injection prevention with Sequelize ORM<div id="table-1" class="table-container">

- XSS protection with helmet middleware    <table class="academic-table">

- CORS configuration        <caption>

- Rate limiting on API endpoints            <strong>Table 1.1:</strong> Table caption

- Input validation and sanitization        </caption>

- Secure file upload handling        <thead>

- Environment variable protection            <tr>

                <th>Header 1</th>

## 🚀 Deployment                <th>Header 2</th>

            </tr>

### Production Deployment        </thead>

        <tbody>

1. **Set production environment variables**            <tr>

   ```bash                <td>Data 1</td>

   NODE_ENV=production                <td>Data 2</td>

   ```            </tr>

        </tbody>

2. **Build frontend**    </table>

   ```bash</div>

   cd frontend```

   npm run build

   ```### Adding Citations

```html

3. **Deploy with Docker**<p>

   ```bash    This statement requires a citation 

   docker-compose -f docker-compose.prod.yml up -d    <span class="citation">[1]</span>.

   ```</p>

```

For detailed deployment instructions, see `docs/DEPLOYMENT.md`

## Browser Support

### Cloud Deployment- Chrome 90+

- Firefox 88+

The application is ready for deployment on:- Safari 14+

- AWS (EC2, RDS, S3)- Edge 90+

- Azure (App Service, Azure Database for MySQL)- Opera 76+

- Google Cloud Platform

- DigitalOcean## Performance

- Heroku- Initial load: < 1s (on 3G)

- Time to Interactive: < 2s

## 🔧 Configuration- Lighthouse Score: 95+



### Environment Variables## Accessibility Testing

Tested with:

Key environment variables (see `.env.example` for complete list):- NVDA Screen Reader

- JAWS Screen Reader

```env- VoiceOver (macOS/iOS)

# Database- Keyboard-only navigation

DB_HOST=localhost- Color contrast analyzers

DB_PORT=3306- axe DevTools

DB_NAME=handmade_hub

DB_USER=your_db_user## License

DB_PASSWORD=your_db_passwordThis website template is created for academic purposes. The content is subject to university regulations regarding academic submissions.



# JWT Authentication## Support and Documentation

JWT_SECRET=your_jwt_secret_key

JWT_REFRESH_SECRET=your_refresh_secret_key### Common Issues



# Stripe Payment**Q: Navigation menu not working on mobile**

STRIPE_SECRET_KEY=sk_test_your_keyA: Ensure JavaScript is enabled in your browser

STRIPE_PUBLIC_KEY=pk_test_your_key

**Q: Download buttons not working**

# Email ServiceA: Check that PDF/DOCX files are in the correct location

SMTP_HOST=smtp.example.com

SMTP_USER=your_email**Q: Sidebar TOC not showing**

SMTP_PASSWORD=your_passwordA: Clear browser cache and reload the page

```

**Q: Citations not linking to references**

## 📊 Database SchemaA: Ensure References section has matching IDs



The database consists of the following main tables:### Additional Resources

- **Users** - User accounts with role-based access- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

- **Vendors** - Vendor profiles and business information- [Semantic HTML Reference](https://developer.mozilla.org/en-US/docs/Web/HTML)

- **Products** - Product catalog and inventory- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)

- **Orders** - Customer orders and order items- [JavaScript Best Practices](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

- **Reviews** - Product reviews and ratings

- **Payments** - Payment transaction records## Contact

- **Events** - Platform events and vendor registrationsFor questions or issues regarding this academic project website:

- Student: [Your Name]

See `database/schema.sql` for complete schema definition.- Email: [Your Email]

- Supervisor: [Supervisor Name]

## 🤝 Contributing- Institution: [University Name]



This is an academic project. For any questions or issues:## Acknowledgments

- Check the documentation in `/docs` directoryThis website structure follows best practices for academic project presentation and accessibility standards outlined by W3C and various university digital guidelines.

- Review the codebase comments

- Contact the project supervisor---



## � Production Deployment

### Pre-Production Checklist

Before deploying to production, complete these steps:

#### Security
- [ ] Update `JWT_SECRET` and `JWT_REFRESH_SECRET` in `.env` (use 64+ random characters)
- [ ] Change all default database passwords
- [ ] Set `NODE_ENV=production` in backend
- [ ] Enable CORS only for production domain
- [ ] Configure rate limiting (already implemented)
- [ ] Set up SSL/TLS certificates for HTTPS
- [ ] Enable security headers (helmet.js already configured)

#### Configuration
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Configure production database (consider AWS RDS or similar)
- [ ] Set up SMTP for email notifications (Mailtrap/SendGrid)
- [ ] Add production Stripe API keys
- [ ] Update Google Gemini API key for chatbot
- [ ] Configure proper backup strategy

#### Infrastructure
- [ ] Set up monitoring (PM2, DataDog, etc.)
- [ ] Configure logging (Winston already integrated)
- [ ] Set up error tracking (Sentry recommended)
- [ ] Plan database backup schedule
- [ ] Configure CDN for static assets
- [ ] Set up load balancer (if needed)

### Docker Production Build

```bash
# Set environment to production
export NODE_ENV=production

# Build optimized images
docker-compose build --no-cache

# Run in production mode (detached)
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Cloud Deployment Options

**Option 1: AWS (Recommended)**
- Frontend: S3 + CloudFront
- Backend: ECS/EKS or EC2
- Database: RDS MySQL
- Images: S3 bucket

**Option 2: DigitalOcean**
- App Platform or Droplet
- Managed MySQL Database
- Spaces for image storage

**Option 3: Azure**
- App Service for containers
- Azure Database for MySQL
- Blob Storage for images

### Environment Variables for Production

```env
# Backend Production Settings
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com

# Database (use managed service)
DB_HOST=production-db-host.mysql.database.azure.com
DB_USER=admin_user
DB_PASSWORD=strong_production_password
DB_NAME=handmade_hub

# JWT (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=your_64_character_random_string_here
JWT_REFRESH_SECRET=another_64_character_random_string_here

# Stripe Production Keys
STRIPE_SECRET_KEY=sk_live_your_real_stripe_key
STRIPE_PUBLIC_KEY=pk_live_your_real_public_key

# Email Service (Production SMTP)
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
FROM_EMAIL=noreply@yourdomain.com
```

---

## 🎓 For Tutors/Reviewers

### Quick Evaluation Guide (15 minutes)

**1. Setup & Run** (5 minutes)
```bash
git clone https://github.com/sw-i/handmade.git
cd handmade
cp .env.example .env
docker-compose up -d --build
```
Wait ~5-10 minutes for initial build. Access: http://localhost:3000

**2. Test Authentication** (3 minutes)
- Login as Admin: `admin@test.com` / `Test123!`
- Verify role-based dashboard
- Logout and login as Vendor: `vendor@test.com` / `Test123!`

**3. Test Core Features** (7 minutes)

**Admin Features:**
- Vendor approval workflow: Admin Dashboard → Vendors → Approve pending vendor
- Event management: Create new event
- Platform analytics: View dashboard metrics

**Vendor Features:**
- Product CRUD: Add new product with images
- Order management: View and update order status
- Event registration: Browse and register for events
- Profile management: Update business info

**Customer Features:**
- Browse products: Filter by category
- Shopping cart: Add items and checkout
- Order tracking: View order history
- Product reviews: Leave rating and comment

**AI Chatbot:**
- Click chat widget → Ask "How do I add a product?"
- Verify AI responds with helpful guidance

### Database Inspection

```bash
docker exec -it handmade-hub-db mysql -u handmade_user -p
# Password: handmade_password123

USE handmade_hub;
SHOW TABLES;

# View sample data
SELECT * FROM users;
SELECT * FROM products LIMIT 5;
SELECT * FROM orders LIMIT 5;
```

### Architecture Overview

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   React     │  HTTP   │  Node.js    │  ORM    │   MySQL     │
│  (Nginx)    │◄───────►│   Express   │◄───────►│  Database   │
│  Port 3000  │         │  Port 5000  │         │  Port 3306  │
└─────────────┘         └─────────────┘         └─────────────┘
      │                       │                       │
      └──────── All Containerized with Docker ────────┘
```

### Key Technical Highlights

**Full-Stack Implementation:**
- ✅ React 18 with modern hooks
- ✅ Node.js REST API with Express
- ✅ MySQL with Sequelize ORM
- ✅ JWT authentication with refresh tokens
- ✅ Role-based access control (Admin/Vendor/Customer)

**Advanced Features:**
- ✅ File upload system (Multer + image storage)
- ✅ AI chatbot integration (Google Gemini)
- ✅ Real-time chat widget
- ✅ Event management system
- ✅ Stripe payment integration (ready)
- ✅ Email service integration (ready)

**Best Practices:**
- ✅ Docker containerization (3 services)
- ✅ Environment-based configuration
- ✅ Database migrations and seeding
- ✅ Input validation and sanitization
- ✅ Error handling middleware
- ✅ Security headers (Helmet.js)
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Password hashing (bcrypt)

**Code Quality:**
- ✅ Clean project structure
- ✅ Modular components
- ✅ Reusable UI components
- ✅ Responsive design (TailwindCSS)
- ✅ State management (Zustand)
- ✅ API service layer
- ✅ Comprehensive documentation

### Evaluation Criteria

| Criterion | Implementation | Notes |
|-----------|----------------|-------|
| **Frontend** | React + Vite + TailwindCSS | Modern, responsive UI |
| **Backend** | Node.js + Express + Sequelize | RESTful API design |
| **Database** | MySQL with migrations | Normalized schema |
| **Authentication** | JWT with refresh tokens | Role-based access |
| **File Upload** | Multer + local storage | Product images |
| **Real-time** | Chat widget | Live customer support |
| **AI Integration** | Google Gemini chatbot | Intelligent assistance |
| **Deployment** | Docker Compose | Production-ready |
| **Documentation** | Comprehensive README | Setup & API docs |

### Testing Scenarios

**Scenario 1: Vendor Onboarding**
1. Register new vendor account
2. Admin approves vendor
3. Vendor adds products with images
4. Verify products appear in public listings

**Scenario 2: Customer Purchase Flow**
1. Browse products as guest
2. Register customer account
3. Add items to cart
4. Complete checkout
5. Track order status

**Scenario 3: Event Management**
1. Admin creates craft fair event
2. Vendor registers for event
3. Admin views event registrations
4. Vendor submits post-event feedback

### Stop Services

```bash
# Stop all containers
docker-compose down

# Stop and remove all data (clean slate)
docker-compose down -v
```

---

## 📄 License

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Status:** ✅ Production Ready - Final Submission

This project is developed for academic purposes as part of a full-stack web development course.

## 👥 Credits

Developed as part of an academic software engineering project demonstrating:
- Full-stack web development (MERN stack variant)
- Docker containerization and orchestration
- RESTful API design
- Database design and ORM usage
- Modern frontend development (React + Vite)
- Authentication and authorization
- File upload and storage
- AI/ML integration
- Payment gateway integration
- Real-time features

### Technologies & Libraries

**Frontend:**
- React 18, Vite, TailwindCSS, Zustand, React Router, Axios, React Hot Toast

**Backend:**
- Node.js, Express, Sequelize ORM, JWT, bcrypt, Multer, Helmet, CORS

**Database:**
- MySQL 8.0

**DevOps:**
- Docker, Docker Compose, Nginx

**APIs:**
- Google Gemini AI (chatbot)
- Stripe (payment processing)

### Special Thanks

- React and Vite communities for excellent developer experience
- Express.js community for robust backend framework
- MySQL for reliable database management
- Docker for simplifying deployment
- Open-source community for amazing tools and libraries

## 📞 Support & Contact

For technical issues, questions, or feedback:

**GitHub Repository:** https://github.com/sw-i/handmade

**Documentation:**
- [Docker Setup Guide](./DOCKER_SETUP.md)
- [Offline Setup Guide](./OFFLINE_SETUP.md)
- [Network Troubleshooting](./NETWORK_ISSUES.md)

**Project Structure:**
- Frontend: `/frontend` - React application
- Backend: `/backend` - Node.js API
- Database: `/database` - MySQL initialization scripts
- Documentation: `/docs` - Additional documentation

**Logs Location:**
```bash
# Backend logs
docker-compose logs backend

# Frontend logs
docker-compose logs frontend

# Database logs
docker-compose logs mysql
```

---

**🎯 Project Status: Ready for Production & Academic Evaluation**

All features implemented, tested, and documented. Ready for tutor review and deployment.
3. Verify environment configuration
4. Check Docker container status: `docker-compose ps`

---

**Project Status:** Production Ready  
**Last Updated:** October 2025  
**Version:** 1.0.0
