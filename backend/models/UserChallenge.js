const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const UserChallenge = sequelize.define('UserChallenge', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  challengeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'health_challenges',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'abandoned'),
    allowNull: false,
    defaultValue: 'active'
  },
  progress: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'user_challenges',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['challengeId']
    },
    {
      fields: ['status']
    },
    {
      unique: true,
      fields: ['userId', 'challengeId']
    }
  ]
});

module.exports = UserChallenge;

