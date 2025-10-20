import api from './api';

// Authentication & User
export const authService = {
  // Register
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout
  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  // Update user details
  updateDetails: async (userData) => {
    const response = await api.put('/auth/updatedetails', userData);
    return response.data;
  },

  // Update password
  updatePassword: async (passwords) => {
    const response = await api.put('/auth/updatepassword', passwords);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgotpassword', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await api.put(`/auth/resetpassword/${token}`, { password });
    return response.data;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await api.get(`/auth/verify/${token}`);
    return response.data;
  },
};

// Products
export const productService = {
  // Get all products (with filters)
  getProducts: async (params) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get single product
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  },

  // Create product (vendor/admin)
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product (vendor/admin)
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product (vendor/admin)
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Upload product images
  uploadImages: async (id, formData, onProgress) => {
    const response = await api.post(`/products/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
    return response.data;
  },
};

// Orders
export const orderService = {
  // Create order
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get user's orders
  getOrders: async (params) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Get single order
  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data.data;
  },

  // Update order status (admin)
  updateOrderStatus: async (id, statusData) => {
    const response = await api.put(`/orders/${id}/status`, statusData);
    return response.data;
  },

  // Get vendor orders
  getVendorOrders: async (params) => {
    const response = await api.get('/orders/vendor/me', { params });
    return response.data;
  },
};

// Vendors
export const vendorService = {
  // Get all vendors (public)
  getVendors: async (params) => {
    const response = await api.get('/vendors', { params });
    return response.data;
  },

  // Get single vendor (public)
  getVendor: async (id) => {
    const response = await api.get(`/vendors/${id}`);
    return response.data.data;
  },

  // Get my vendor profile
  getMyProfile: async () => {
    const response = await api.get('/vendors/me/profile');
    return response.data.data;
  },

  // Update vendor profile
  updateProfile: async (vendorData) => {
    const response = await api.put('/vendors/me/profile', vendorData);
    return response.data;
  },

  // Get vendor analytics
  getAnalytics: async (params) => {
    const response = await api.get('/vendors/me/analytics', { params });
    return response.data.data;
  },

  // Approve vendor (admin)
  approveVendor: async (id) => {
    const response = await api.put(`/vendors/${id}/approve`);
    return response.data;
  },

  // Reject vendor (admin)
  rejectVendor: async (id) => {
    const response = await api.put(`/vendors/${id}/reject`);
    return response.data;
  },

  // Suspend vendor (admin)
  suspendVendor: async (id) => {
    const response = await api.put(`/vendors/${id}/suspend`);
    return response.data;
  },

  // Unsuspend vendor (admin)
  unsuspendVendor: async (id) => {
    const response = await api.put(`/vendors/${id}/unsuspend`);
    return response.data;
  },

  // Delete vendor (admin)
  deleteVendor: async (id) => {
    const response = await api.delete(`/vendors/${id}`);
    return response.data;
  },

  // Get pending vendors (admin)
  getPendingVendors: async () => {
    const response = await api.get('/vendors/pending');
    return response.data;
  },
};

// Reviews
export const reviewService = {
  // Get product reviews
  getProductReviews: async (productId, params) => {
    const response = await api.get(`/products/${productId}/reviews`, { params });
    return response.data;
  },

  // Create review
  createReview: async (productId, reviewData) => {
    const response = await api.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
  },

  // Update review
  updateReview: async (productId, reviewId, reviewData) => {
    const response = await api.put(`/products/${productId}/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // Delete review
  deleteReview: async (productId, reviewId) => {
    const response = await api.delete(`/products/${productId}/reviews/${reviewId}`);
    return response.data;
  },

  // Respond to review (vendor)
  respondToReview: async (productId, reviewId, response) => {
    const res = await api.put(`/products/${productId}/reviews/${reviewId}/respond`, { response });
    return res.data;
  },
};

// Admin
export const adminService = {
  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Get all customers
  getCustomers: async (params) => {
    const response = await api.get('/admin/customers', { params });
    return response.data;
  },

  // Update customer status
  updateCustomerStatus: async (id, status) => {
    const response = await api.put(`/admin/customers/${id}/status`, { status });
    return response.data;
  },

  // Get all products
  getAllProducts: async (params) => {
    const response = await api.get('/admin/products', { params });
    return response.data;
  },

  // Update product status
  updateProductStatus: async (id, data) => {
    const response = await api.put(`/admin/products/${id}/status`, data);
    return response.data;
  },

  // Get all payments
  getPayments: async (params) => {
    const response = await api.get('/admin/payments', { params });
    return response.data;
  },

  // Process refund
  processRefund: async (id) => {
    const response = await api.post(`/admin/payments/${id}/refund`);
    return response.data;
  },
};

export { chatService } from './chatService';

export default {
  auth: authService,
  products: productService,
  orders: orderService,
  vendors: vendorService,
  reviews: reviewService,
  admin: adminService,
};
