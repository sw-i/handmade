const { Vendor, User, Product, OrderItem, Order } = require('../models');
const { getPagination, getPaginationData } = require('../utils/helpers');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const logger = require('../utils/logger');

/**
 * @desc    Get all vendors
 * @route   GET /api/v1/vendors
 * @access  Public / Admin
 */
exports.getVendors = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, sortBy = 'created_at', order = 'DESC', status } = req.query;
    const { limit: queryLimit, offset } = getPagination(page, limit);
    
    // Build where clause based on status filter
    const where = {};
    
    if (status) {
      // Admin filtering by status
      if (status === 'pending') {
        where.isApproved = false;
      } else if (status === 'approved') {
        where.isApproved = true;
      }
      // 'all' status returns all vendors (no filter on isApproved)
    } else {
      // Public endpoint - only show approved vendors
      where.isApproved = true;
    }
    
    if (search) {
      where[Op.or] = [
        { businessName: { [Op.like]: `%${search}%` } },
        { businessDescription: { [Op.like]: `%${search}%` } }
      ];
    }
    
    const { count, rows: vendors } = await Vendor.findAndCountAll({
      where,
      limit: queryLimit,
      offset,
      order: [[sortBy, order]],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['email', 'firstName', 'lastName']
        }
      ]
    });
    
    // Calculate statistics for each vendor
    const vendorsWithStats = await Promise.all(
      vendors.map(async (vendor) => {
        const vendorData = vendor.toJSON();
        
        // Get total products count (only active and approved products)
        const totalProducts = await Product.count({
          where: { 
            vendorId: vendor.id,
            isActive: true,
            status: 'approved'
          }
        });
        
        // Get total sales and revenue from order items
        const orderStats = await OrderItem.findOne({
          where: { vendorId: vendor.id },
          attributes: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'totalSales'],
            [sequelize.fn('SUM', sequelize.col('total_price')), 'totalRevenue']
          ],
          raw: true
        });
        
        // Get average rating from product reviews
        const { sequelize: db } = require('../config/database');
        const ratingResult = await db.query(
          `SELECT AVG(r.rating) as avgRating
           FROM reviews r
           INNER JOIN products p ON r.product_id = p.id
           WHERE p.vendor_id = :vendorId`,
          {
            replacements: { vendorId: vendor.id },
            type: db.QueryTypes.SELECT
          }
        );
        
        return {
          ...vendorData,
          totalProducts: totalProducts || 0,
          totalSales: parseInt(orderStats?.totalSales) || 0,
          totalRevenue: parseFloat(orderStats?.totalRevenue) || 0,
          rating: parseFloat(ratingResult[0]?.avgRating) || 0
        };
      })
    );
    
    res.status(200).json({
      success: true,
      count: vendorsWithStats.length,
      pagination: getPaginationData(count, parseInt(page), queryLimit),
      data: vendorsWithStats
    });
  } catch (error) {
    logger.error('Get vendors error:', error);
    next(error);
  }
};

/**
 * @desc    Get single vendor
 * @route   GET /api/v1/vendors/:id
 * @access  Public
 */
exports.getVendor = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if it's a UUID or username
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    let vendor;
    if (isUUID) {
      vendor = await Vendor.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['email', 'firstName', 'lastName']
          },
          {
            model: Product,
            as: 'products',
            where: { isActive: true },
            required: false,
            limit: 12,
            order: [['created_at', 'DESC']]
          }
        ]
      });
    } else {
      // Treat as username
      vendor = await Vendor.findOne({
        where: { username: id },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['email', 'firstName', 'lastName']
          },
          {
            model: Product,
            as: 'products',
            where: { isActive: true },
            required: false,
            limit: 12,
            order: [['created_at', 'DESC']]
          }
        ]
      });
    }
    
    if (!vendor || !vendor.isApproved) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: vendor
    });
  } catch (error) {
    logger.error('Get vendor error:', error);
    next(error);
  }
};

/**
 * @desc    Get vendor profile (own)
 * @route   GET /api/v1/vendors/me
 * @access  Private (Vendor)
 */
exports.getMyVendorProfile = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['email', 'firstName', 'lastName', 'phone']
        }
      ]
    });
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: vendor
    });
  } catch (error) {
    logger.error('Get vendor profile error:', error);
    next(error);
  }
};

/**
 * @desc    Update vendor profile
 * @route   PUT /api/v1/vendors/me
 * @access  Private (Vendor)
 */
exports.updateVendorProfile = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }
    
    const allowedFields = [
      'businessName',
      'businessDescription',
      'logoUrl',
      'bannerUrl',
      'address',
      'city',
      'state',
      'country',
      'postalCode',
      'businessPhone',
      'businessEmail',
      'website',
      'username',
      'facebookUrl',
      'instagramUrl',
      'twitterUrl',
      'linkedinUrl',
      'bankAccount',
      'taxId'
    ];
    
    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
    
    // Validate username uniqueness if it's being updated
    if (updateData.username) {
      const existingVendor = await Vendor.findOne({
        where: { username: updateData.username }
      });
      
      if (existingVendor && existingVendor.id !== vendor.id) {
        return res.status(400).json({
          success: false,
          message: 'Username is already taken. Please choose another one.'
        });
      }
    }
    
    await vendor.update(updateData);
    
    res.status(200).json({
      success: true,
      data: vendor
    });
  } catch (error) {
    logger.error('Update vendor profile error:', error);
    next(error);
  }
};

/**
 * @desc    Get vendor analytics
 * @route   GET /api/v1/vendors/me/analytics
 * @access  Private (Vendor)
 */
exports.getVendorAnalytics = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }
    
    const { startDate, endDate } = req.query;
    const dateFilter = {};
    
    if (startDate) dateFilter[Op.gte] = new Date(startDate);
    if (endDate) dateFilter[Op.lte] = new Date(endDate);
    
    // Get total products
    const totalProducts = await Product.count({
      where: { vendorId: vendor.id }
    });
    
    const activeProducts = await Product.count({
      where: { vendorId: vendor.id, isActive: true }
    });
    
    // Get order statistics
    const orderItems = await OrderItem.findAll({
      where: { vendorId: vendor.id },
      include: [
        {
          model: Order,
          as: 'order',
          where: {
            ...(Object.keys(dateFilter).length && { created_at: dateFilter }),
            status: { [Op.notIn]: ['cancelled', 'refunded'] }
          }
        }
      ]
    });
    
    let totalRevenue = 0;
    let totalCommission = 0;
    let totalPayout = 0;
    const totalOrders = new Set();
    
    orderItems.forEach(item => {
      totalRevenue += parseFloat(item.totalPrice);
      totalCommission += parseFloat(item.commission);
      totalPayout += parseFloat(item.vendorPayout);
      totalOrders.add(item.orderId);
    });
    
    // Get product views
    const products = await Product.findAll({
      where: { vendorId: vendor.id },
      attributes: ['id', 'title', 'views', 'salesCount'],
      order: [['views', 'DESC']],
      limit: 10
    });
    
    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalProducts,
          activeProducts,
          totalOrders: totalOrders.size,
          totalRevenue,
          totalCommission,
          totalPayout,
          rating: vendor.rating
        },
        topProducts: products
      }
    });
  } catch (error) {
    logger.error('Get vendor analytics error:', error);
    next(error);
  }
};

/**
 * @desc    Approve vendor (Admin only)
 * @route   PUT /api/v1/vendors/:id/approve
 * @access  Private (Admin)
 */
exports.approveVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }
    
    await vendor.update({
      isApproved: true,
      approvedAt: new Date(),
      approvedBy: req.user.id
    });
    
    // TODO: Send approval email to vendor
    
    logger.info(`Vendor ${vendor.id} approved by admin ${req.user.id}`);
    
    res.status(200).json({
      success: true,
      message: 'Vendor approved successfully',
      data: vendor
    });
  } catch (error) {
    logger.error('Approve vendor error:', error);
    next(error);
  }
};

/**
 * @desc    Reject vendor (Admin only)
 * @route   PUT /api/v1/vendors/:id/reject
 * @access  Private (Admin)
 */
exports.rejectVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }
    
    // For now, just set isApproved to false
    // In future, could add isRejected field and rejection reason
    await vendor.update({
      isApproved: false,
      approvedAt: null,
      approvedBy: null
    });
    
    // TODO: Send rejection email to vendor
    
    logger.info(`Vendor ${vendor.id} rejected by admin ${req.user.id}`);
    
    res.status(200).json({
      success: true,
      message: 'Vendor rejected',
      data: vendor
    });
  } catch (error) {
    logger.error('Reject vendor error:', error);
    next(error);
  }
};

/**
 * @desc    Suspend/Freeze vendor account (Admin only)
 * @route   PUT /api/v1/vendors/:id/suspend
 * @access  Private (Admin)
 */
exports.suspendVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'user'
      }]
    });
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Suspend the vendor's user account
    await vendor.user.update({
      isActive: false
    });
    
    logger.info(`Vendor ${vendor.id} suspended by admin ${req.user.id}`);
    
    res.status(200).json({
      success: true,
      message: 'Vendor account suspended successfully',
      data: vendor
    });
  } catch (error) {
    logger.error('Suspend vendor error:', error);
    next(error);
  }
};

/**
 * @desc    Unsuspend/Unfreeze vendor account (Admin only)
 * @route   PUT /api/v1/vendors/:id/unsuspend
 * @access  Private (Admin)
 */
exports.unsuspendVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'user'
      }]
    });
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Reactivate the vendor's user account
    await vendor.user.update({
      isActive: true
    });
    
    logger.info(`Vendor ${vendor.id} unsuspended by admin ${req.user.id}`);
    
    res.status(200).json({
      success: true,
      message: 'Vendor account reactivated successfully',
      data: vendor
    });
  } catch (error) {
    logger.error('Unsuspend vendor error:', error);
    next(error);
  }
};

/**
 * @desc    Delete vendor account (Admin only)
 * @route   DELETE /api/v1/vendors/:id
 * @access  Private (Admin)
 */
exports.deleteVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'user'
      }]
    });
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    const vendorEmail = vendor.user.email;
    const userId = vendor.user.id;
    
    // Delete vendor and associated user (cascade will handle related records)
    await vendor.destroy();
    await User.destroy({ where: { id: userId } });
    
    logger.info(`Vendor ${vendor.id} (${vendorEmail}) deleted by admin ${req.user.id}`);
    
    res.status(200).json({
      success: true,
      message: 'Vendor account deleted successfully'
    });
  } catch (error) {
    logger.error('Delete vendor error:', error);
    next(error);
  }
};

/**
 * @desc    Get pending vendor approvals (Admin only)
 * @route   GET /api/v1/vendors/pending
 * @access  Private (Admin)
 */
exports.getPendingVendors = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { limit: queryLimit, offset } = getPagination(page, limit);
    
    const { count, rows: vendors } = await Vendor.findAndCountAll({
      where: { isApproved: false },
      limit: queryLimit,
      offset,
      order: [['created_at', 'ASC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['email', 'firstName', 'lastName', 'phone']
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      count: vendors.length,
      pagination: getPaginationData(count, parseInt(page), queryLimit),
      data: vendors
    });
  } catch (error) {
    logger.error('Get pending vendors error:', error);
    next(error);
  }
};
