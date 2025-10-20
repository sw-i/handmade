const { Order, OrderItem, Product, User, Vendor } = require('../models');
const { generateOrderNumber, calculateCommission, getPagination, getPaginationData } = require('../utils/helpers');
const logger = require('../utils/logger');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * @desc    Create new order
 * @route   POST /api/v1/orders
 * @access  Private
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, billingAddress, paymentMethod } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order'
      });
    }
    
    // Validate products and calculate totals
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findByPk(item.productId, {
        include: [{ model: Vendor, as: 'vendor' }]
      });
      
      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.productId} not found or inactive`
        });
      }
      
      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.title}`
        });
      }
      
      const itemTotal = product.price * item.quantity;
      const commission = calculateCommission(itemTotal, product.vendor.commissionRate);
      
      orderItems.push({
        productId: product.id,
        vendorId: product.vendorId,
        productTitle: product.title,
        productImage: product.images?.[0]?.imageUrl || null,
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice: itemTotal,
        commission,
        vendorPayout: itemTotal - commission
      });
      
      subtotal += itemTotal;
    }
    
    // Calculate totals (you can add shipping and tax logic here)
    const shippingCost = 0; // TODO: Implement shipping calculation
    const tax = subtotal * 0.1; // 10% tax rate - customize as needed
    const totalAmount = subtotal + shippingCost + tax;
    
    // Create order
    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      customerId: req.user.id,
      subtotal,
      shippingCost,
      tax,
      totalAmount,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      customerEmail: req.user.email,
      customerPhone: req.user.phone,
      paymentMethod
    });
    
    // Create order items
    for (const item of orderItems) {
      await OrderItem.create({
        orderId: order.id,
        ...item
      });
      
      // Update product stock
      await Product.decrement('stockQuantity', {
        by: item.quantity,
        where: { id: item.productId }
      });
      
      await Product.increment('salesCount', {
        by: item.quantity,
        where: { id: item.productId }
      });
    }
    
    // Process payment with Stripe
    if (paymentMethod === 'card') {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(totalAmount * 100), // Convert to cents
          currency: 'usd',
          metadata: {
            orderId: order.id,
            orderNumber: order.orderNumber
          }
        });
        
        await order.update({
          paymentIntentId: paymentIntent.id,
          paymentStatus: 'pending'
        });
        
        return res.status(201).json({
          success: true,
          data: order,
          clientSecret: paymentIntent.client_secret
        });
      } catch (stripeError) {
        logger.error('Stripe payment error:', stripeError);
        await order.update({ paymentStatus: 'failed' });
      }
    }
    
    logger.info(`Order created: ${order.orderNumber}`);
    
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    logger.error('Create order error:', error);
    next(error);
  }
};

/**
 * @desc    Get all orders (for customer)
 * @route   GET /api/v1/orders
 * @access  Private
 */
exports.getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const { limit: queryLimit, offset } = getPagination(page, limit);
    
    const where = { customerId: req.user.id };
    if (status) where.status = status;
    
    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      limit: queryLimit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'title', 'slug']
            }
          ]
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      count: orders.length,
      pagination: getPaginationData(count, parseInt(page), queryLimit),
      data: orders
    });
  } catch (error) {
    logger.error('Get orders error:', error);
    next(error);
  }
};

/**
 * @desc    Get single order
 * @route   GET /api/v1/orders/:id
 * @access  Private
 */
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            },
            {
              model: Vendor,
              as: 'vendor',
              attributes: ['id', 'businessName', 'businessEmail', 'businessPhone']
            }
          ]
        },
        {
          model: User,
          as: 'customer',
          attributes: ['id', 'email', 'firstName', 'lastName']
        }
      ]
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check authorization
    if (req.user.role === 'customer' && order.customerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    logger.error('Get order error:', error);
    next(error);
  }
};

/**
 * @desc    Update order status
 * @route   PUT /api/v1/orders/:id/status
 * @access  Private (Vendor/Admin)
 */
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber, carrier } = req.body;
    
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    const updateData = { status };
    
    if (status === 'shipped') {
      updateData.shippedAt = new Date();
      if (trackingNumber) updateData.trackingNumber = trackingNumber;
      if (carrier) updateData.carrier = carrier;
    } else if (status === 'delivered') {
      updateData.deliveredAt = new Date();
    } else if (status === 'cancelled') {
      updateData.cancelledAt = new Date();
      updateData.cancellationReason = req.body.cancellationReason;
    }
    
    await order.update(updateData);
    
    // TODO: Send email notification to customer
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    logger.error('Update order status error:', error);
    next(error);
  }
};

/**
 * @desc    Get vendor orders
 * @route   GET /api/v1/orders/vendor/me
 * @access  Private (Vendor)
 */
exports.getVendorOrders = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }
    
    const { page = 1, limit = 20, status } = req.query;
    const { limit: queryLimit, offset } = getPagination(page, limit);
    
    const orderItems = await OrderItem.findAll({
      where: { vendorId: vendor.id },
      include: [
        {
          model: Order,
          as: 'order',
          where: status ? { status } : {},
          include: [
            {
              model: User,
              as: 'customer',
              attributes: ['firstName', 'lastName', 'email', 'phone']
            }
          ]
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'title']
        }
      ],
      limit: queryLimit,
      offset,
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      count: orderItems.length,
      data: orderItems
    });
  } catch (error) {
    logger.error('Get vendor orders error:', error);
    next(error);
  }
};
