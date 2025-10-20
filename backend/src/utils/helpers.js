const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

/**
 * Generate unique order number
 */
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

/**
 * Generate random token
 */
const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate slug from string
 */
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Calculate pagination metadata
 */
const getPagination = (page, limit) => {
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const offset = (pageNum - 1) * limitNum;

  return { limit: limitNum, offset, page: pageNum };
};

/**
 * Format pagination response
 */
const getPaginationData = (count, page, limit) => {
  const totalPages = Math.ceil(count / limit);
  return {
    currentPage: page,
    totalPages,
    totalItems: count,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
};

/**
 * Calculate commission
 */
const calculateCommission = (amount, rate) => {
  return parseFloat((amount * (rate / 100)).toFixed(2));
};

/**
 * Format currency
 */
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};

module.exports = {
  generateOrderNumber,
  generateToken,
  generateSlug,
  getPagination,
  getPaginationData,
  calculateCommission,
  formatCurrency
};
