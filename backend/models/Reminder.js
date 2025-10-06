const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const Reminder = sequelize.define('Reminder', {
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
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('medication', 'hydration', 'exercise', 'assessment', 'mental-health', 'sleep', 'nutrition', 'general'),
    allowNull: false,
    defaultValue: 'general'
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    }
  },
  frequency: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly'),
    allowNull: false,
    defaultValue: 'daily'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  lastTriggered: {
    type: DataTypes.DATE,
    allowNull: true
  },
  nextTrigger: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completionNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'reminders',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['nextTrigger']
    },
    {
      fields: ['type']
    }
  ]
});

module.exports = Reminder;

