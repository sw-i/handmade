const { verifyToken } = require('../utils/jwtHelper');
const { User } = require('../models');
const logger = require('../utils/logger');

/**
 * Protect routes - verify JWT token
 */
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Get user from token
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password', 'verificationToken', 'resetPasswordToken'] }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists or is inactive'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

/**
 * Grant access to specific roles
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

/**
 * Check if user is vendor and owns the resource
 */
exports.isVendorOwner = async (req, res, next) => {
  try {
    const { Vendor } = require('../models');
    
    const vendor = await Vendor.findOne({
      where: { userId: req.user.id }
    });

    if (!vendor) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized - vendor profile not found'
      });
    }

    // Attach vendor to request
    req.vendor = vendor;
    next();
  } catch (error) {
    logger.error('Vendor ownership check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking vendor ownership'
    });
  }
};

/**
 * Optional authentication - attaches user to request if token is valid, but doesn't fail if no token
 * Useful for routes that have different behavior for authenticated vs non-authenticated users
 */
exports.optionalAuth = async (req, res, next) => {
  let token;

  // Check for token in headers or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  // If no token, just continue without user
  if (!token) {
    return next();
  }

  try {
    // Verify token
    const decoded = verifyToken(token);

    if (decoded) {
      // Get user from token
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password', 'verificationToken', 'resetPasswordToken'] }
      });

      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Token is invalid, but we don't fail - just continue without user
    logger.warn('Optional auth - invalid token provided, continuing without user');
    next();
  }
};
