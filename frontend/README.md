# Handmade Hub - Frontend

Modern React frontend for the Handmade Hub marketplace platform.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router 6** - Client-side routing
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form validation
- **Yup** - Schema validation
- **Stripe Elements** - Payment processing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

## Project Structure

```
src/
├── assets/          # Static assets (images, icons)
├── components/      # Reusable components
│   ├── auth/        # Authentication components
│   ├── common/      # Common UI components
│   ├── layouts/     # Layout components
│   ├── products/    # Product-related components
│   ├── orders/      # Order-related components
│   └── vendors/     # Vendor-related components
├── hooks/           # Custom React hooks
├── pages/           # Page components
│   ├── public/      # Public pages
│   ├── auth/        # Auth pages
│   ├── customer/    # Customer dashboard pages
│   ├── vendor/      # Vendor dashboard pages
│   └── admin/       # Admin dashboard pages
├── services/        # API services
├── store/           # Zustand stores
├── utils/           # Utility functions
├── App.jsx          # Main app component
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Environment Variables

Create a `.env` file in the frontend root:

```bash
VITE_API_URL=http://localhost:5000/api/v1
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key_here
```

## Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Run tests
npm test

# Run tests in watch mode
npm test:watch
```

## Features

### Public Features
- Browse products with search, filtering, and sorting
- View product details with images and reviews
- Browse vendor profiles
- Responsive design for all devices

### Customer Features
- User registration and authentication
- Shopping cart functionality
- Secure checkout with Stripe
- Order history and tracking
- Product reviews and ratings
- Profile management

### Vendor Features
- Vendor dashboard with analytics
- Product management (CRUD)
- Order management and fulfillment
- Sales analytics and reports
- Profile and business information management
- Review responses

### Admin Features
- Admin dashboard with platform analytics
- Vendor approval workflow
- User management
- Platform-wide analytics

## State Management

### Auth State (Zustand)
- User authentication status
- User profile data
- Role-based access control
- Persistent storage

### Cart State (Zustand)
- Shopping cart items
- Quantity management
- Total calculations
- Persistent storage

### Server State (TanStack Query)
- Products data
- Orders data
- Vendor data
- Automatic caching and refetching
- Optimistic updates

## Routing

### Public Routes
- `/` - Homepage
- `/products` - Product listing
- `/products/:id` - Product details
- `/vendors` - Vendor listing
- `/vendors/:id` - Vendor profile

### Auth Routes
- `/login` - User login
- `/register` - User registration
- `/forgot-password` - Password reset

### Protected Routes (Customer)
- `/dashboard` - Customer dashboard
- `/dashboard/orders` - Order history
- `/dashboard/orders/:id` - Order details
- `/dashboard/profile` - Profile settings
- `/checkout` - Checkout page

### Protected Routes (Vendor)
- `/vendor` - Vendor dashboard
- `/vendor/products` - Product management
- `/vendor/orders` - Order management
- `/vendor/analytics` - Sales analytics
- `/vendor/profile` - Vendor profile

### Protected Routes (Admin)
- `/admin` - Admin dashboard
- `/admin/vendors` - Vendor approvals
- `/admin/analytics` - Platform analytics

## API Integration

All API calls are made through the services layer (`src/services/`):

```javascript
import { productService } from '@services';

// Fetch products
const products = await productService.getProducts({
  page: 1,
  limit: 12,
  search: 'handmade',
  category: 'jewelry',
});

// Create product
const newProduct = await productService.createProduct({
  title: 'Handmade Necklace',
  price: 29.99,
  // ...
});
```

## Custom Hooks

### useAuth
```javascript
import { useAuth } from '@hooks/useAuth';

const { user, login, logout, isLoading } = useAuth();
```

### useCart
```javascript
import { useCart } from '@hooks/useCart';

const { items, addItem, removeItem, total } = useCart();
```

### useProducts
```javascript
import { useProducts } from '@hooks/useProducts';

const { data, isLoading, error } = useProducts({ page: 1 });
```

## Styling

### Tailwind CSS Classes

Custom utility classes defined in `index.css`:

```css
/* Buttons */
.btn, .btn-primary, .btn-secondary, .btn-outline

/* Forms */
.input, .input-error, .label, .error-message

/* Cards */
.card, .card-hover

/* Layout */
.container

/* Status */
.badge, .badge-success, .badge-warning, .badge-error
```

### Color Scheme

- Primary: Red shades (#ef4444)
- Secondary: Purple shades (#8b5cf6)
- Background: Gray-50
- Text: Gray-900

## Form Validation

Using React Hook Form + Yup:

```javascript
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

const { register, handleSubmit, errors } = useForm({
  resolver: yupResolver(schema),
});
```

## Payment Integration

Stripe Elements for secure payments:

```javascript
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

<Elements stripe={stripePromise}>
  <CheckoutForm />
</Elements>
```

## Error Handling

Global error handling via Axios interceptors:
- 401: Redirect to login
- 403: Permission denied toast
- 429: Rate limit toast
- 500: Server error toast

Component-level error handling with error boundaries.

## Performance Optimization

- Code splitting with React.lazy
- Image lazy loading
- Route-based code splitting
- TanStack Query caching
- Memoization with useMemo/useCallback
- Virtual scrolling for long lists

## Accessibility

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Color contrast compliance (WCAG 2.1 AA)

## Testing

```bash
# Run tests
npm test

# Coverage report
npm test -- --coverage
```

Test files should be colocated with components:
```
components/
├── Button.jsx
└── Button.test.jsx
```

## Build & Deployment

### Production Build

```bash
npm run build
```

Output: `dist/` directory

### Docker Build

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment-Specific Builds

```bash
# Development
npm run build -- --mode development

# Staging
npm run build -- --mode staging

# Production
npm run build -- --mode production
```

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety (optional)
3. Write tests for new features
4. Follow ESLint rules
5. Use meaningful commit messages

## Troubleshooting

### Module Resolution Errors
Check `vite.config.js` path aliases are correct.

### API Connection Issues
Verify `VITE_API_URL` in `.env` file.

### Build Failures
Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## License

Private - All Rights Reserved
