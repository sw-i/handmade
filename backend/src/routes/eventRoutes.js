const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for event banner uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/events/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'event-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Public routes (optionalAuth allows authenticated users to get extra data)
router.get('/', optionalAuth, eventController.getEvents);

// Analytics route (must come before /:id to avoid route conflict)
router.get('/:id/analytics', protect, eventController.getEventAnalytics);

// Event details with optional auth (admins get pending registrations, vendors get their registration status)
router.get('/:id', optionalAuth, eventController.getEventById);

// Admin-only routes (create, update, delete events)
router.post('/', protect, authorize('admin'), upload.single('banner'), eventController.createEvent);
router.put('/:id', protect, authorize('admin'), upload.single('banner'), eventController.updateEvent);
router.delete('/:id', protect, authorize('admin'), eventController.deleteEvent);

// Vendor registration routes (vendors can register for events)
router.post('/:id/register', protect, authorize('vendor'), eventController.registerForEvent);
router.delete('/:id/register', protect, authorize('vendor'), eventController.unregisterFromEvent);

// Feedback route (vendors can submit feedback after attending)
router.post('/:id/feedback', protect, authorize('vendor'), eventController.submitFeedback);

// Admin approval routes (admins can approve or reject vendor registrations)
router.put('/:eventId/registrations/:registrationId/approve', protect, authorize('admin'), eventController.approveRegistration);
router.put('/:eventId/registrations/:registrationId/reject', protect, authorize('admin'), eventController.rejectRegistration);

module.exports = router;
