const express = require('express');
const { body } = require('express-validator');
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  respondToReview
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validator');

const router = express.Router({ mergeParams: true });

// Validation rules
const reviewValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').optional().trim(),
  body('comment').optional().trim()
];

const respondValidation = [
  body('response').trim().notEmpty().withMessage('Response is required')
];

// Routes
router.get('/', getProductReviews);
router.post('/', protect, reviewValidation, validate, createReview);
router.put('/:id', protect, reviewValidation, validate, updateReview);
router.delete('/:id', protect, deleteReview);
router.put('/:id/respond', protect, authorize('vendor', 'admin'), respondValidation, validate, respondToReview);

module.exports = router;
