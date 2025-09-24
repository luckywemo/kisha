const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const AssessmentSubmission = sequelize.define('AssessmentSubmission', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  responses: { type: DataTypes.JSON, allowNull: false },
  score: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'assessment_submissions',
  timestamps: true,
});

module.exports = AssessmentSubmission;


