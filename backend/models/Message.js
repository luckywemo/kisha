const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const Message = sequelize.define('Message', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  type: { type: DataTypes.ENUM('user', 'system'), allowNull: false, defaultValue: 'user' },
  message: { type: DataTypes.TEXT, allowNull: false }
}, {
  tableName: 'messages',
  timestamps: true,
});

module.exports = Message;


