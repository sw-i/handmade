const { User, Vendor, Product, Order, OrderItem, Category } = require('../models');
const { Op, fn, col } = require('sequelize');
const sequelize = require('../config/database');

// Get admin dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    // Total users (excluding admins)
    const totalUsers = await User.count({
      where: {
        role: {
          [Op.in]: ['customer', 'vendor']
        }
      }
    });

    // Total vendors
    const totalVendors = await Vendor.count();

    // Pending vendor approvals (using is_approved column)
    const pendingVendors = await Vendor.count({
      where: {
        is_approved: false
      }
    });

    // Total orders
    const totalOrders = await Order.count();

    // Total revenue (sum of all completed orders)
    const revenueData = await Order.findOne({
      attributes: [
        [fn('SUM', col('total_amount')), 'totalRevenue']
      ],
      where: {
        status: {
          [Op.in]: ['delivered', 'completed']
        }
      },
      raw: true
    });

    const totalRevenue = parseFloat(revenueData?.totalRevenue || 0);

    // Calculate revenue growth (compare last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const recentRevenue = await Order.findOne({
      attributes: [
        [fn('SUM', col('total_amount')), 'revenue']
      ],
      where: {
        status: { [Op.in]: ['delivered', 'completed'] },
        created_at: { [Op.gte]: thirtyDaysAgo }
      },
      raw: true
    });

    const previousRevenue = await Order.findOne({
      attributes: [
        [fn('SUM', col('total_amount')), 'revenue']
      ],
      where: {
        status: { [Op.in]: ['delivered', 'completed'] },
        created_at: {
          [Op.gte]: sixtyDaysAgo,
          [Op.lt]: thirtyDaysAgo
        }
      },
      raw: true
    });

    const recentRev = parseFloat(recentRevenue?.revenue || 0);
    const previousRev = parseFloat(previousRevenue?.revenue || 0);
    const revenueGrowth = previousRev > 0 ? ((recentRev - previousRev) / previousRev * 100).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalVendors,
        pendingVendors,
        totalOrders,
        totalRevenue,
        revenueGrowth: parseFloat(revenueGrowth)
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
};

// Get all customers with filtering and search
exports.getCustomers = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {
      role: 'customer'
    };

    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    const { count, rows: customers } = await User.findAndCountAll({
      where: whereClause,
      attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'status', 'created_at', 'updated_at'],
      include: [
        {
          model: Order,
          as: 'orders',
          attributes: ['id', 'total_amount', 'status'],
          required: false
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    // Calculate total orders and total spent for each customer
    const customersData = customers.map(customer => {
      const customerObj = customer.toJSON();
      const orders = customerObj.orders || [];
      const completedOrders = orders.filter(o => ['delivered', 'completed'].includes(o.status));
      
      return {
        id: customerObj.id,
        name: `${customerObj.first_name} ${customerObj.last_name}`,
        email: customerObj.email,
        phone: customerObj.phone || 'N/A',
        status: customerObj.status || 'active',
        totalOrders: orders.length,
        totalSpent: completedOrders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0),
        joinedDate: customerObj.created_at,
        lastActive: customerObj.updated_at
      };
    });

    res.json({
      success: true,
      data: {
        customers: customersData,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customers'
    });
  }
};

// Update customer status (suspend/activate)
exports.updateCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "active" or "suspended"'
      });
    }

    const customer = await User.findOne({
      where: {
        id,
        role: 'customer'
      }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    customer.status = status;
    await customer.save();

    res.json({
      success: true,
      message: `Customer ${status === 'active' ? 'activated' : 'suspended'} successfully`,
      data: {
        id: customer.id,
        status: customer.status
      }
    });
  } catch (error) {
    console.error('Update customer status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update customer status'
    });
  }
};

// Get all products across all vendors
exports.getAllProducts = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Vendor,
          as: 'vendor',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['first_name', 'last_name', 'email']
            }
          ]
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: OrderItem,
          as: 'orderItems',
          attributes: ['id', 'quantity'],
          required: false
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    const productsData = products.map(product => {
      const productObj = product.toJSON();
      const vendorName = productObj.vendor?.user 
        ? `${productObj.vendor.user.first_name} ${productObj.vendor.user.last_name}`
        : 'Unknown Vendor';

      return {
        id: productObj.id,
        name: productObj.name,
        vendor: vendorName,
        vendorId: productObj.vendor_id,
        category: productObj.category?.name || 'Uncategorized',
        price: parseFloat(productObj.price),
        stock: productObj.stock,
        status: productObj.status || 'approved',
        flagged: productObj.flagged || false,
        sales: productObj.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0,
        createdDate: productObj.created_at
      };
    });

    res.json({
      success: true,
      data: {
        products: productsData,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
};

// Update product status
exports.updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, flagged } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (status) {
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status'
        });
      }
      product.status = status;
    }

    if (flagged !== undefined) {
      product.flagged = flagged;
    }

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: {
        id: product.id,
        status: product.status,
        flagged: product.flagged
      }
    });
  } catch (error) {
    console.error('Update product status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    });
  }
};

// Get all payments/transactions
exports.getPayments = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};

    if (status && status !== 'all') {
      if (status === 'completed') {
        whereClause.status = { [Op.in]: ['delivered', 'completed'] };
      } else if (status === 'refunded') {
        whereClause.status = 'refunded';
      } else if (status === 'pending') {
        whereClause.status = { [Op.in]: ['pending', 'processing', 'shipped'] };
      }
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'customer',
          attributes: ['first_name', 'last_name', 'email']
        },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Vendor,
              as: 'vendor',
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['first_name', 'last_name']
                }
              ]
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    const paymentsData = orders.map(order => {
      const orderObj = order.toJSON();
      const customerName = orderObj.customer 
        ? `${orderObj.customer.first_name} ${orderObj.customer.last_name}`
        : 'Unknown Customer';

      // Get unique vendors from order items
      const vendors = orderObj.items?.map(item => {
        if (item.vendor?.user) {
          return `${item.vendor.user.first_name} ${item.vendor.user.last_name}`;
        }
        return 'Unknown Vendor';
      }) || [];
      const uniqueVendors = [...new Set(vendors)];
      const vendorNames = uniqueVendors.join(', ');

      const amount = parseFloat(orderObj.total_amount);
      const platformFee = amount * 0.10; // 10% platform fee
      const vendorPayout = amount - platformFee;

      let paymentStatus = 'pending';
      if (['delivered', 'completed'].includes(orderObj.status)) {
        paymentStatus = 'completed';
      } else if (orderObj.status === 'refunded') {
        paymentStatus = 'refunded';
      }

      return {
        id: orderObj.id,
        orderId: orderObj.orderNumber || `ORD-${orderObj.id}`,
        customer: customerName,
        vendor: vendorNames || 'Multiple Vendors',
        amount: amount,
        platformFee: platformFee,
        vendorPayout: vendorPayout,
        status: paymentStatus,
        paymentMethod: orderObj.paymentMethod || 'Credit Card',
        date: orderObj.createdAt
      };
    });

    res.json({
      success: true,
      data: {
        payments: paymentsData,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments'
    });
  }
};

// Process refund (future implementation - placeholder)
exports.processRefund = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (!['delivered', 'completed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Only completed orders can be refunded'
      });
    }

    // Update order status to refunded
    order.status = 'refunded';
    await order.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        id: order.id,
        status: order.status
      }
    });
  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process refund'
    });
  }
};

module.exports = exports;
