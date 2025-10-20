const express = require('express');
const { body } = require('express-validator');
const {
  getVendors,
  getVendor,
  getMyVendorProfile,
  updateVendorProfile,
  getVendorAnalytics,
  approveVendor,
  rejectVendor,
  suspendVendor,
  unsuspendVendor,
  deleteVendor,
  getPendingVendors
} = require('../controllers/vendorController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validator');

const router = express.Router();

// Validation rules
const updateVendorValidation = [
  body('businessName').optional({ checkFalsy: true }).trim().notEmpty().withMessage('Business name cannot be empty'),
  body('businessEmail').optional({ checkFalsy: true }).isEmail().withMessage('Valid business email required'),
  body('businessPhone').optional().trim(),
  body('website').optional().custom((value) => {
    if (!value || value === '') return true; // Allow empty strings
    // Simple URL validation
    try {
      new URL(value);
      return true;
    } catch (err) {
      throw new Error('Valid website URL required');
    }
  }),
  body('facebookUrl').optional().custom((value) => {
    if (!value || value === '') return true;
    try {
      new URL(value);
      return true;
    } catch (err) {
      throw new Error('Valid Facebook URL required');
    }
  }),
  body('instagramUrl').optional().custom((value) => {
    if (!value || value === '') return true;
    try {
      new URL(value);
      return true;
    } catch (err) {
      throw new Error('Valid Instagram URL required');
    }
  }),
  body('twitterUrl').optional().custom((value) => {
    if (!value || value === '') return true;
    try {
      new URL(value);
      return true;
    } catch (err) {
      throw new Error('Valid Twitter URL required');
    }
  }),
  body('linkedinUrl').optional().custom((value) => {
    if (!value || value === '') return true;
    try {
      new URL(value);
      return true;
    } catch (err) {
      throw new Error('Valid LinkedIn URL required');
    }
  })
];

// Public routes
router.get('/', getVendors);
router.get('/:id', getVendor);

// Vendor routes
router.get('/me/profile', protect, authorize('vendor'), getMyVendorProfile);
router.put('/me/profile', protect, authorize('vendor'), updateVendorValidation, validate, updateVendorProfile);
router.get('/me/analytics', protect, authorize('vendor'), getVendorAnalytics);

// Admin routes
router.get('/admin/pending', protect, authorize('admin'), getPendingVendors);
router.put('/:id/approve', protect, authorize('admin'), approveVendor);
router.put('/:id/reject', protect, authorize('admin'), rejectVendor);
router.put('/:id/suspend', protect, authorize('admin'), suspendVendor);
router.put('/:id/unsuspend', protect, authorize('admin'), unsuspendVendor);
router.delete('/:id', protect, authorize('admin'), deleteVendor);

module.exports = router;
