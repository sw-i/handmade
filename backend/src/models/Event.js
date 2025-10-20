const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM('craft_fair', 'workshop', 'exhibition', 'marketplace', 'conference', 'networking', 'other'),
    allowNull: false,
    defaultValue: 'other'
  },
  eventType: {
    type: DataTypes.ENUM('physical', 'virtual', 'hybrid'),
    allowNull: false,
    defaultValue: 'physical'
  },
  location: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  virtualLink: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  registrationDeadline: {
    type: DataTypes.DATE,
    allowNull: false
  },
  maxCapacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
  },
  currentParticipants: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  bannerImage: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'ongoing', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: 'draft'
  },
  visibility: {
    type: DataTypes.ENUM('public', 'invite_only', 'private'),
    allowNull: false,
    defaultValue: 'public'
  },
  organizerId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'vendors',
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  schedule: {
    type: DataTypes.JSON,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'events',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['organizer_id'] },
    { fields: ['status'] },
    { fields: ['category'] },
    { fields: ['start_date'] },
    { fields: ['visibility'] }
  ]
});

module.exports = Event;
