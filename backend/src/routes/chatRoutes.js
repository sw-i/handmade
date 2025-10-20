const express = require('express');
const router = express.Router();
const { chat, chatSimple } = require('../controllers/chatController');
const rateLimit = require('express-rate-limit');

// Rate limiting for chat endpoints to prevent abuse
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: 'Too many chat requests, please try again later.'
});

// Streaming chat endpoint
router.post('/', chatLimiter, chat);

// Simple non-streaming chat endpoint
router.post('/simple', chatLimiter, chatSimple);

module.exports = router;
