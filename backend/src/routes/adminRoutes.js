const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Protect all admin routes
router.use(protect);
router.use(authorize('admin'));

// Dashboard stats
router.get('/stats', adminController.getDashboardStats);

// Customer management
router.get('/customers', adminController.getCustomers);
router.put('/customers/:id/status', adminController.updateCustomerStatus);

// Product management
router.get('/products', adminController.getAllProducts);
router.put('/products/:id/status', adminController.updateProductStatus);

// Payment management
router.get('/payments', adminController.getPayments);
router.post('/payments/:id/refund', adminController.processRefund);

module.exports = router;
