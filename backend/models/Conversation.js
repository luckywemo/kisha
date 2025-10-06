const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const Conversation = sequelize.define('Conversation', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'conversations',
  timestamps: true,
});

module.exports = Conversation;


