const { Review, Product, User, Order, OrderItem } = require('../models');
const { getPagination, getPaginationData } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * @desc    Get reviews for a product
 * @route   GET /api/v1/products/:productId/reviews
 * @access  Public
 */
exports.getProductReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, sortBy = 'created_at', order = 'DESC' } = req.query;
    const { limit: queryLimit, offset } = getPagination(page, limit);
    
    const { count, rows: reviews } = await Review.findAndCountAll({
      where: {
        productId: req.params.productId,
        isApproved: true
      },
      limit: queryLimit,
      offset,
      order: [[sortBy, order]],
      include: [
        {
          model: User,
          as: 'customer',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      pagination: getPaginationData(count, parseInt(page), queryLimit),
      data: reviews
    });
  } catch (error) {
    logger.error('Get product reviews error:', error);
    next(error);
  }
};

/**
 * @desc    Create review
 * @route   POST /api/v1/products/:productId/reviews
 * @access  Private
 */
exports.createReview = async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body;
    const productId = req.params.productId;
    
    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check if user has purchased the product
    const purchase = await OrderItem.findOne({
      include: [
        {
          model: Order,
          as: 'order',
          where: {
            customerId: req.user.id,
            status: 'delivered'
          }
        }
      ],
      where: { productId }
    });
    
    // Check if review already exists
    const existingReview = await Review.findOne({
      where: {
        productId,
        customerId: req.user.id
      }
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }
    
    // Create review
    const review = await Review.create({
      productId,
      customerId: req.user.id,
      orderId: purchase?.orderId || null,
      rating,
      title,
      comment,
      isVerifiedPurchase: !!purchase
    });
    
    // Update product rating
    const { sequelize } = require('../config/database');
    const [results] = await sequelize.query(
      `SELECT AVG(rating) as avgRating, COUNT(*) as count 
       FROM reviews 
       WHERE product_id = :productId AND is_approved = true`,
      {
        replacements: { productId },
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    await product.update({
      rating: parseFloat(results.avgRating).toFixed(2),
      reviewCount: results.count
    });
    
    logger.info(`Review created for product ${productId} by user ${req.user.id}`);
    
    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    logger.error('Create review error:', error);
    next(error);
  }
};

/**
 * @desc    Update review
 * @route   PUT /api/v1/reviews/:id
 * @access  Private
 */
exports.updateReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Check ownership
    if (review.customerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }
    
    const { rating, title, comment } = req.body;
    await review.update({ rating, title, comment });
    
    // Recalculate product rating
    const product = await Product.findByPk(review.productId);
    const { sequelize } = require('../config/database');
    const [results] = await sequelize.query(
      `SELECT AVG(rating) as avgRating, COUNT(*) as count 
       FROM reviews 
       WHERE product_id = :productId AND is_approved = true`,
      {
        replacements: { productId: review.productId },
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    await product.update({
      rating: parseFloat(results.avgRating).toFixed(2),
      reviewCount: results.count
    });
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    logger.error('Update review error:', error);
    next(error);
  }
};

/**
 * @desc    Delete review
 * @route   DELETE /api/v1/reviews/:id
 * @access  Private
 */
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Check ownership or admin
    if (review.customerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }
    
    const productId = review.productId;
    await review.destroy();
    
    // Recalculate product rating
    const product = await Product.findByPk(productId);
    const { sequelize } = require('../config/database');
    const [results] = await sequelize.query(
      `SELECT AVG(rating) as avgRating, COUNT(*) as count 
       FROM reviews 
       WHERE product_id = :productId AND is_approved = true`,
      {
        replacements: { productId },
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    await product.update({
      rating: results.avgRating ? parseFloat(results.avgRating).toFixed(2) : 0,
      reviewCount: results.count || 0
    });
    
    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    logger.error('Delete review error:', error);
    next(error);
  }
};

/**
 * @desc    Vendor response to review
 * @route   PUT /api/v1/reviews/:id/respond
 * @access  Private (Vendor)
 */
exports.respondToReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          as: 'product',
          include: [
            {
              model: require('../models').Vendor,
              as: 'vendor',
              where: { userId: req.user.id }
            }
          ]
        }
      ]
    });
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or not authorized'
      });
    }
    
    await review.update({
      vendorResponse: req.body.response,
      respondedAt: new Date()
    });
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    logger.error('Respond to review error:', error);
    next(error);
  }
};
