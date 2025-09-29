const { sequelize } = require('../db/config');
const User = require('./User');
const Conversation = require('./Conversation');
const Message = require('./Message');
const AssessmentForm = require('./AssessmentForm');
const AssessmentSubmission = require('./AssessmentSubmission');
const Medication = require('./Medication');
const HealthGoal = require('./HealthGoal');
const Symptom = require('./Symptom');
const JournalEntry = require('./JournalEntry');

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

User.hasMany(HealthGoal, { foreignKey: 'userId' });
HealthGoal.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Symptom, { foreignKey: 'userId' });
Symptom.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(JournalEntry, { foreignKey: 'userId' });
JournalEntry.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Conversation,
  Message,
  AssessmentForm,
  AssessmentSubmission,
  Medication,
  HealthGoal,
  Symptom,
  JournalEntry,
};


