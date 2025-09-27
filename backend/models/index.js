const { sequelize } = require('../db/config');
const User = require('./User');
const Conversation = require('./Conversation');
const Message = require('./Message');
const AssessmentForm = require('./AssessmentForm');
const AssessmentSubmission = require('./AssessmentSubmission');
const Medication = require('./Medication');

// Associations
User.hasMany(Conversation, { foreignKey: 'userId' });
Conversation.belongsTo(User, { foreignKey: 'userId' });

Conversation.hasMany(Message, { foreignKey: 'conversationId', onDelete: 'CASCADE' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId' });

User.hasMany(AssessmentSubmission, { foreignKey: 'userId' });
AssessmentSubmission.belongsTo(User, { foreignKey: 'userId' });

AssessmentForm.hasMany(AssessmentSubmission, { foreignKey: 'formId' });
AssessmentSubmission.belongsTo(AssessmentForm, { foreignKey: 'formId' });

User.hasMany(Medication, { foreignKey: 'userId' });
Medication.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Conversation,
  Message,
  AssessmentForm,
  AssessmentSubmission,
  Medication,
};


