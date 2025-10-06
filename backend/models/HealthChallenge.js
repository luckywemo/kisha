const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const HealthChallenge = sequelize.define('HealthChallenge', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('fitness', 'nutrition', 'sleep', 'mental-health', 'hydration', 'meditation', 'stress-management', 'social'),
    allowNull: false
  },
  targetValue: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'points'
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 7,
    comment: 'Duration in days'
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100
  },
  requirements: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  tips: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  tableName: 'health_challenges',
  timestamps: true,
  indexes: [
    {
      fields: ['category']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['createdBy']
    }
  ]
});

module.exports = HealthChallenge;

