const { Product, ProductImage, Vendor, Category, Review, User } = require('../models');
const { getPagination, getPaginationData, generateSlug } = require('../utils/helpers');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

/**
 * @desc    Get all products with filters
 * @route   GET /api/v1/products
 * @access  Public
 */
exports.getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, category, minPrice, maxPrice, sortBy = 'created_at', order = 'DESC', featured, vendor } = req.query;
    
    const { limit: queryLimit, offset } = getPagination(page, limit);
    
    // Build where clause
    const where = {};
    
    // Handle vendor filter - if 'me', show all products including inactive
    if (vendor === 'me' && req.user) {
      const vendorRecord = await Vendor.findOne({ where: { userId: req.user.id } });
      if (vendorRecord) {
        where.vendorId = vendorRecord.id;
        // Don't filter by isActive for vendor's own products
      }
    } else if (vendor) {
      // Public vendor page - show only this vendor's active and approved products
      where.vendorId = vendor;
      where.isActive = true;
      where.status = 'approved';
    } else {
      // Public products only - must be active AND approved
      where.isActive = true;
      where.status = 'approved';
    }
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (category) {
      where.categoryId = category;
    }
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }
    
    if (featured === 'true') {
      where.isFeatured = true;
    }
    
    const { count, rows: products } = await Product.findAndCountAll({
      where,
      limit: queryLimit,
      offset,
      order: [[sortBy, order]],
      include: [
        {
          model: ProductImage,
          as: 'images',
          required: false,
          separate: true,
          order: [['displayOrder', 'ASC']]
        },
        {
          model: Vendor,
          as: 'vendor',
          attributes: ['id', 'businessName', 'rating']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      count: products.length,
      pagination: getPaginationData(count, parseInt(page), queryLimit),
      data: products
    });
  } catch (error) {
    logger.error('Get products error:', error);
    next(error);
  }
};

/**
 * @desc    Get single product
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: ProductImage,
          as: 'images',
          order: [['displayOrder', 'ASC']]
        },
        {
          model: Vendor,
          as: 'vendor',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'email']
            }
          ]
        },
        {
          model: Category,
          as: 'category'
        },
        {
          model: Review,
          as: 'reviews',
          where: { isApproved: true },
          required: false,
          limit: 10,
          order: [['created_at', 'DESC']],
          include: [
            {
              model: User,
              as: 'customer',
              attributes: ['id', 'firstName', 'lastName']
            }
          ]
        }
      ]
    });
    
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Increment views
    await product.increment('views');
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    logger.error('Get product error:', error);
    next(error);
  }
};

/**
 * @desc    Create product
 * @route   POST /api/v1/products
 * @access  Private (Vendor)
 */
exports.createProduct = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
    
    if (!vendor || !vendor.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Vendor account not approved'
      });
    }
    
    const productData = {
      ...req.body,
      vendorId: vendor.id,
      slug: generateSlug(req.body.title)
    };
    
    const product = await Product.create(productData);
    
    logger.info(`Product created: ${product.id} by vendor ${vendor.id}`);
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    logger.error('Create product error:', error);
    next(error);
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/v1/products/:id
 * @access  Private (Vendor/Admin)
 */
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check ownership
    const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
    if (req.user.role !== 'admin' && product.vendorId !== vendor.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }
    
    if (req.body.title) {
      req.body.slug = generateSlug(req.body.title);
    }
    
    product = await product.update(req.body);
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    logger.error('Update product error:', error);
    next(error);
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/v1/products/:id
 * @access  Private (Vendor/Admin)
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check ownership
    const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
    if (req.user.role !== 'admin' && product.vendorId !== vendor.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }
    
    await product.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    logger.error('Delete product error:', error);
    next(error);
  }
};

/**
 * @desc    Upload product images
 * @route   POST /api/v1/products/:id/images
 * @access  Private (Vendor)
 */
exports.uploadProductImages = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check ownership
    const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
    if (product.vendorId !== vendor.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }
    
    const images = await Promise.all(
      req.files.map((file, index) =>
        ProductImage.create({
          productId: product.id,
          imageUrl: `/uploads/${file.filename}`,
          isPrimary: index === 0,
          displayOrder: index
        })
      )
    );
    
    res.status(201).json({
      success: true,
      count: images.length,
      data: images
    });
  } catch (error) {
    logger.error('Upload product images error:', error);
    next(error);
  }
};
