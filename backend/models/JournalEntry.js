const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const JournalEntry = sequelize.define('JournalEntry', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  mood: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 10
    }
  },
  energy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 10
    }
  },
  sleep: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 12
    }
  },
  exercise: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 300
    }
  },
  water: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 8,
    validate: {
      min: 0,
      max: 20
    }
  },
  stress: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 10
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  symptoms: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '[]'
  },
  activities: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '[]'
  },
  meals: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '[]'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  tableName: 'journal_entries',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'date']
    }
  ]
});

module.exports = JournalEntry;
