const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Vendor = sequelize.define('Vendor', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  businessName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  businessDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  logoUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  bannerUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  postalCode: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  businessPhone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  businessEmail: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  website: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true,
    validate: {
      is: /^[a-zA-Z0-9_-]+$/,
      len: [3, 50]
    }
  },
  facebookUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  instagramUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  twitterUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  linkedinUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  bankAccount: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  taxId: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  commissionRate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 10.00,
    allowNull: false,
    get() {
      const value = this.getDataValue('commissionRate');
      return value === null ? null : parseFloat(value);
    }
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  approvedBy: {
    type: DataTypes.UUID,
    allowNull: true
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
  totalSales: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00,
    get() {
      const value = this.getDataValue('totalSales');
      return value === null ? null : parseFloat(value);
    }
  },
  totalOrders: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'vendors',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['is_approved'] },
    { fields: ['business_name'] },
    { fields: ['rating'] }
  ]
});

module.exports = Vendor;
