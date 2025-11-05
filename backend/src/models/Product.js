const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  vendorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'vendors',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    get() {
      const value = this.getDataValue('price');
      return value === null ? null : parseFloat(value);
    },
    validate: {
      min: 0
    }
  },
  compareAtPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    get() {
      const value = this.getDataValue('compareAtPrice');
      return value === null ? null : parseFloat(value);
    }
  },
  costPerItem: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    get() {
      const value = this.getDataValue('costPerItem');
      return value === null ? null : parseFloat(value);
    }
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  sku: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  barcode: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  weight: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
    get() {
      const value = this.getDataValue('weight');
      return value === null ? null : parseFloat(value);
    }
  },
  weightUnit: {
    type: DataTypes.ENUM('kg', 'g', 'lb', 'oz'),
    defaultValue: 'kg'
  },
  dimensions: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Stores {length, width, height, unit}'
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'approved',
    comment: 'Admin moderation status'
  },
  flagged: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Flagged for admin review'
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Priority in appearance - higher values appear first'
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  salesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00,
    get() {
      const value = this.getDataValue('rating');
      return value === null ? null : parseFloat(value);
    },
    validate: {
      min: 0,
      max: 5
    }
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  metaTitle: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  metaDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'products',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['vendor_id'] },
    { fields: ['category_id'] },
    { fields: ['slug'] },
    { fields: ['is_active'] },
    { fields: ['is_featured'] },
    { fields: ['price'] },
    { fields: ['rating'] },
    { fields: ['sales_count'] },
    { type: 'FULLTEXT', fields: ['title', 'description'] }
  ]
});

module.exports = Product;
