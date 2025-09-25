const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const AssessmentForm = sequelize.define('AssessmentForm', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  questions: { type: DataTypes.JSON, allowNull: true }
}, {
  tableName: 'assessment_forms',
  timestamps: true,
});

module.exports = AssessmentForm;


