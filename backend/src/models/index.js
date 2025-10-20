const User = require('./User');
const Vendor = require('./Vendor');
const Category = require('./Category');
const Product = require('./Product');
const ProductImage = require('./ProductImage');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Review = require('./Review');
const Event = require('./Event');
const EventRegistration = require('./EventRegistration');

// User - Vendor relationship (One-to-One)
User.hasOne(Vendor, { foreignKey: 'userId', as: 'vendorProfile' });
Vendor.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Vendor - Product relationship (One-to-Many)
Vendor.hasMany(Product, { foreignKey: 'vendorId', as: 'products' });
Product.belongsTo(Vendor, { foreignKey: 'vendorId', as: 'vendor' });

// Category - Product relationship (One-to-Many)
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Category self-reference (Parent-Child)
Category.hasMany(Category, { foreignKey: 'parentId', as: 'children' });
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });

// Product - ProductImage relationship (One-to-Many)
Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// User - Order relationship (One-to-Many)
User.hasMany(Order, { foreignKey: 'customerId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'customerId', as: 'customer' });

// Order - OrderItem relationship (One-to-Many)
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Product - OrderItem relationship (One-to-Many)
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Vendor - OrderItem relationship (One-to-Many)
Vendor.hasMany(OrderItem, { foreignKey: 'vendorId', as: 'orderItems' });
OrderItem.belongsTo(Vendor, { foreignKey: 'vendorId', as: 'vendor' });

// Product - Review relationship (One-to-Many)
Product.hasMany(Review, { foreignKey: 'productId', as: 'reviews' });
Review.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// User - Review relationship (One-to-Many)
User.hasMany(Review, { foreignKey: 'customerId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'customerId', as: 'customer' });

// Order - Review relationship (One-to-Many)
Order.hasMany(Review, { foreignKey: 'orderId', as: 'reviews' });
Review.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Vendor - Event relationship (One-to-Many)
Vendor.hasMany(Event, { foreignKey: 'organizerId', as: 'organizedEvents' });
Event.belongsTo(Vendor, { foreignKey: 'organizerId', as: 'organizer' });

// Event - EventRegistration relationship (One-to-Many)
Event.hasMany(EventRegistration, { foreignKey: 'eventId', as: 'registrations' });
EventRegistration.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

// Vendor - EventRegistration relationship (One-to-Many)
Vendor.hasMany(EventRegistration, { foreignKey: 'vendorId', as: 'eventRegistrations' });
EventRegistration.belongsTo(Vendor, { foreignKey: 'vendorId', as: 'vendor' });

module.exports = {
  User,
  Vendor,
  Category,
  Product,
  ProductImage,
  Order,
  OrderItem,
  Review,
  Event,
  EventRegistration
};
