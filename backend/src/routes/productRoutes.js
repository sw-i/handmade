const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages
} = require('../controllers/productController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const upload = require('../middleware/upload');

const router = express.Router();

// Validation rules
const productValidation = [
  body('title').trim().notEmpty().withMessage('Product title is required'),
  body('description').optional().trim(),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('categoryId').optional().isUUID().withMessage('Valid category ID required'),
  body('stockQuantity').optional().isInt({ min: 0 }).withMessage('Stock quantity must be 0 or greater')
];

// Public routes (with optional auth for vendor filtering)
router.get('/', optionalAuth, getProducts);
router.get('/:id', getProduct);

// Protected routes
router.post('/', protect, authorize('vendor', 'admin'), productValidation, validate, createProduct);
router.put('/:id', protect, authorize('vendor', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('vendor', 'admin'), deleteProduct);
router.post('/:id/images', protect, authorize('vendor', 'admin'), upload.array('images', 10), uploadProductImages);

module.exports = router;
