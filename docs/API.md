# API Documentation

## Base URL

```
Development: http://localhost:5000/api/v1
Production: https://api.handmadehub.com/api/v1
```

## Authentication

Most endpoints require authentication via JWT token. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

Or the token can be automatically sent via HTTP-only cookies.

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "count": 10,  // Optional: for list endpoints
  "pagination": {  // Optional: for paginated endpoints
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "itemsPerPage": 20,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": [  // Optional: validation errors
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

## Endpoints

### Authentication & Users

#### Register User

```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "customer"  // or "vendor"
}
```

**Response:** 201 Created
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer",
    "emailVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Login

```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer",
    "lastLogin": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get Current User

```http
GET /auth/me
Authorization: Bearer <token>
```

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "email": "vendor@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "vendor",
    "emailVerified": true,
    "vendorProfile": {
      "id": "vendor-uuid",
      "businessName": "Jane's Handmade Jewelry",
      "businessDescription": "Unique handcrafted jewelry pieces",
      "rating": 4.8,
      "isApproved": true
    }
  }
}
```

#### Update User Details

```http
PUT /auth/updatedetails
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890"
}
```

#### Update Password

```http
PUT /auth/updatepassword
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewSecurePass123!"
}
```

#### Forgot Password

```http
POST /auth/forgotpassword
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Password reset link sent to email"
}
```

#### Reset Password

```http
PUT /auth/resetpassword/:resettoken
```

**Request Body:**
```json
{
  "password": "NewPassword123!"
}
```

---

### Products

#### Get All Products

```http
GET /products
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `search` (string): Search in title and description
- `category` (uuid): Filter by category ID
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `sortBy` (string): Sort field (default: createdAt)
- `order` (string): Sort order ASC/DESC (default: DESC)
- `featured` (boolean): Filter featured products

**Example:**
```http
GET /products?page=1&limit=20&category=uuid&minPrice=10&maxPrice=100&sortBy=price&order=ASC
```

**Response:** 200 OK
```json
{
  "success": true,
  "count": 20,
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "itemsPerPage": 20,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "data": [
    {
      "id": "product-uuid",
      "title": "Handmade Leather Wallet",
      "slug": "handmade-leather-wallet",
      "description": "Premium leather wallet with card slots",
      "price": 45.99,
      "stockQuantity": 15,
      "rating": 4.5,
      "reviewCount": 23,
      "images": [
        {
          "imageUrl": "/uploads/wallet-1.jpg",
          "altText": "Brown leather wallet",
          "isPrimary": true
        }
      ],
      "vendor": {
        "id": "vendor-uuid",
        "businessName": "Leather Crafts Co.",
        "rating": 4.7
      },
      "category": {
        "id": "category-uuid",
        "name": "Accessories",
        "slug": "accessories"
      }
    }
  ]
}
```

#### Get Single Product

```http
GET /products/:id
```

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "id": "product-uuid",
    "title": "Handmade Leather Wallet",
    "slug": "handmade-leather-wallet",
    "description": "Premium quality leather wallet...",
    "price": 45.99,
    "compareAtPrice": 59.99,
    "stockQuantity": 15,
    "sku": "WALLET-001",
    "weight": 0.2,
    "weightUnit": "kg",
    "dimensions": {
      "length": 10,
      "width": 8,
      "height": 2,
      "unit": "cm"
    },
    "tags": ["leather", "wallet", "handmade", "accessories"],
    "rating": 4.5,
    "reviewCount": 23,
    "views": 1234,
    "salesCount": 45,
    "isFeatured": true,
    "isActive": true,
    "images": [
      {
        "imageUrl": "/uploads/wallet-1.jpg",
        "altText": "Brown leather wallet front",
        "isPrimary": true,
        "displayOrder": 0
      },
      {
        "imageUrl": "/uploads/wallet-2.jpg",
        "altText": "Brown leather wallet open",
        "isPrimary": false,
        "displayOrder": 1
      }
    ],
    "vendor": {
      "id": "vendor-uuid",
      "businessName": "Leather Crafts Co.",
      "businessDescription": "Quality leather goods since 2015",
      "rating": 4.7,
      "totalOrders": 456,
      "user": {
        "firstName": "John",
        "lastName": "Craftsman",
        "email": "john@leathercrafts.com"
      }
    },
    "category": {
      "id": "category-uuid",
      "name": "Accessories",
      "slug": "accessories",
      "description": "Fashion accessories"
    },
    "reviews": [
      {
        "id": "review-uuid",
        "rating": 5,
        "title": "Excellent quality!",
        "comment": "Beautiful craftsmanship, very satisfied",
        "isVerifiedPurchase": true,
        "customer": {
          "id": "customer-uuid",
          "firstName": "Jane",
          "lastName": "D."
        },
        "createdAt": "2024-01-15T10:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-20T00:00:00.000Z"
  }
}
```

#### Create Product (Vendor/Admin)

```http
POST /products
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Handmade Ceramic Mug",
  "description": "Beautiful hand-painted ceramic mug",
  "price": 24.99,
  "compareAtPrice": 34.99,
  "stockQuantity": 50,
  "categoryId": "category-uuid",
  "sku": "MUG-001",
  "weight": 0.4,
  "weightUnit": "kg",
  "tags": ["ceramic", "mug", "handmade", "pottery"],
  "dimensions": {
    "length": 10,
    "width": 10,
    "height": 12,
    "unit": "cm"
  },
  "metaTitle": "Handmade Ceramic Mug - Unique Design",
  "metaDescription": "Shop unique handmade ceramic mug..."
}
```

**Response:** 201 Created

#### Upload Product Images (Vendor/Admin)

```http
POST /products/:id/images
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `images`: File[] (max 10 images)

**Response:** 201 Created
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "image-uuid-1",
      "productId": "product-uuid",
      "imageUrl": "/uploads/abc123.jpg",
      "isPrimary": true,
      "displayOrder": 0
    },
    {
      "id": "image-uuid-2",
      "productId": "product-uuid",
      "imageUrl": "/uploads/def456.jpg",
      "isPrimary": false,
      "displayOrder": 1
    }
  ]
}
```

---

### Orders

#### Create Order

```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "product-uuid-1",
      "quantity": 2
    },
    {
      "productId": "product-uuid-2",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA",
    "phone": "+1234567890"
  },
  "billingAddress": {
    // Same structure as shippingAddress, optional
  },
  "paymentMethod": "card"  // "card", "paypal", "cash"
}
```

**Response:** 201 Created
```json
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "orderNumber": "ORD-2024-ABC123",
    "status": "pending",
    "paymentStatus": "pending",
    "subtotal": 95.97,
    "shippingCost": 0.00,
    "tax": 9.60,
    "totalAmount": 105.57,
    "currency": "USD",
    "createdAt": "2024-01-20T10:00:00.000Z"
  },
  "clientSecret": "pi_xxx_secret_xxx"  // For Stripe payment
}
```

#### Get Customer Orders

```http
GET /orders
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number)
- `limit` (number)
- `status` (string): Filter by status

**Response:** 200 OK (array of orders)

#### Get Single Order

```http
GET /orders/:id
Authorization: Bearer <token>
```

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "orderNumber": "ORD-2024-ABC123",
    "status": "processing",
    "paymentStatus": "paid",
    "subtotal": 95.97,
    "shippingCost": 5.00,
    "tax": 9.60,
    "totalAmount": 110.57,
    "shippingAddress": {
      "fullName": "John Doe",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "USA"
    },
    "items": [
      {
        "id": "item-uuid",
        "productTitle": "Handmade Leather Wallet",
        "productImage": "/uploads/wallet.jpg",
        "quantity": 2,
        "unitPrice": 45.99,
        "totalPrice": 91.98,
        "product": {
          "id": "product-uuid",
          "slug": "handmade-leather-wallet"
        },
        "vendor": {
          "id": "vendor-uuid",
          "businessName": "Leather Crafts Co.",
          "businessEmail": "contact@leathercrafts.com"
        }
      }
    ],
    "customer": {
      "id": "customer-uuid",
      "email": "customer@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "createdAt": "2024-01-20T10:00:00.000Z",
    "updatedAt": "2024-01-20T11:00:00.000Z"
  }
}
```

#### Update Order Status (Vendor/Admin)

```http
PUT /orders/:id/status
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "shipped",  // "pending", "processing", "shipped", "delivered", "cancelled"
  "trackingNumber": "1Z999AA10123456784",  // Optional
  "carrier": "UPS",  // Optional
  "cancellationReason": "Out of stock"  // Required for cancelled status
}
```

---

### Vendors

#### Get All Vendors

```http
GET /vendors
```

**Query Parameters:**
- `page`, `limit`, `search`, `sortBy`, `order`

**Response:** 200 OK (array of vendors)

#### Get Vendor Profile

```http
GET /vendors/:id
```

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "id": "vendor-uuid",
    "businessName": "Artisan Jewelry Co.",
    "businessDescription": "Unique handcrafted jewelry since 2015",
    "logoUrl": "/uploads/logo.jpg",
    "bannerUrl": "/uploads/banner.jpg",
    "city": "Portland",
    "state": "Oregon",
    "country": "USA",
    "rating": 4.8,
    "totalSales": 15234.50,
    "totalOrders": 234,
    "isApproved": true,
    "user": {
      "email": "vendor@example.com",
      "firstName": "Jane",
      "lastName": "Smith"
    },
    "products": [
      // Array of recent products
    ]
  }
}
```

#### Get Own Vendor Profile (Vendor)

```http
GET /vendors/me/profile
Authorization: Bearer <token>
```

#### Update Vendor Profile (Vendor)

```http
PUT /vendors/me/profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "businessName": "Updated Business Name",
  "businessDescription": "Updated description",
  "address": "456 Market St",
  "city": "San Francisco",
  "state": "CA",
  "postalCode": "94102",
  "businessPhone": "+1234567890",
  "businessEmail": "business@example.com",
  "website": "https://mybusiness.com"
}
```

#### Get Vendor Analytics (Vendor)

```http
GET /vendors/me/analytics?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalProducts": 45,
      "activeProducts": 40,
      "totalOrders": 123,
      "totalRevenue": 5432.10,
      "totalCommission": 543.21,
      "totalPayout": 4888.89,
      "rating": 4.7
    },
    "topProducts": [
      {
        "id": "product-uuid",
        "title": "Best Selling Item",
        "views": 1234,
        "salesCount": 45
      }
    ]
  }
}
```

---

### Reviews

#### Get Product Reviews

```http
GET /products/:productId/reviews
```

**Query Parameters:**
- `page`, `limit`, `sortBy`, `order`

**Response:** 200 OK (array of reviews)

#### Create Review

```http
POST /products/:productId/reviews
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 5,
  "title": "Excellent product!",
  "comment": "Very satisfied with the quality and craftsmanship"
}
```

**Response:** 201 Created

#### Update Review

```http
PUT /reviews/:id
Authorization: Bearer <token>
```

#### Delete Review

```http
DELETE /reviews/:id
Authorization: Bearer <token>
```

#### Vendor Response to Review

```http
PUT /reviews/:id/respond
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "response": "Thank you for your feedback! We're glad you love it."
}
```

---

## Rate Limiting

- General API: 100 requests per 15 minutes per IP
- Authentication endpoints: 5 requests per 15 minutes per IP
- Password reset: 3 requests per hour per IP

## Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Pagination

List endpoints support pagination:

```http
GET /products?page=2&limit=50
```

Response includes pagination metadata:

```json
{
  "pagination": {
    "currentPage": 2,
    "totalPages": 10,
    "totalItems": 500,
    "itemsPerPage": 50,
    "hasNextPage": true,
    "hasPreviousPage": true
  }
}
```

## Webhooks (Stripe)

The platform listens for Stripe webhook events at:

```http
POST /api/v1/webhooks/stripe
```

Supported events:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`
