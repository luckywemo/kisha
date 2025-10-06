const express = require('express');
const { Op } = require('sequelize');
const { 
  AssessmentResult, 
  HealthGoal, 
  Symptom, 
  Medication, 
  JournalEntry,
  Reminder,
  User,
  Conversation,
  Message
} = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Export user data in JSON format
router.post('/json', auth, async (req, res) => {
  try {
    const { categories, startDate, endDate } = req.body;
    const userId = req.user.id;
    
    const start = startDate ? new Date(startDate) : new Date('2020-01-01');
    const end = endDate ? new Date(endDate) : new Date();
    
    const exportData = {};
    
    // Export profile data
    if (!categories || categories.includes('profile')) {
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });
      exportData.profile = user;
    }
    
    // Export assessments
    if (!categories || categories.includes('assessments')) {
      const assessments = await AssessmentResult.findAll({
        where: { 
          userId,
          createdAt: { [Op.between]: [start, end] }
        },
        order: [['createdAt', 'DESC']]
      });
      exportData.assessments = assessments;
    }
    
    // Export goals
    if (!categories || categories.includes('goals')) {
      const goals = await HealthGoal.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']]
      });
      exportData.goals = goals;
    }
    
    // Export symptoms
    if (!categories || categories.includes('symptoms')) {
      const symptoms = await Symptom.findAll({
        where: { 
          userId,
          createdAt: { [Op.between]: [start, end] }
        },
        order: [['createdAt', 'DESC']]
      });
      exportData.symptoms = symptoms;
    }
    
    // Export medications
    if (!categories || categories.includes('medications')) {
      const medications = await Medication.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']]
      });
      exportData.medications = medications;
    }
    
    // Export journal entries
    if (!categories || categories.includes('journal')) {
      const journalEntries = await JournalEntry.findAll({
        where: { 
          userId,
          date: { [Op.between]: [startDate || '2020-01-01', endDate || new Date().toISOString().split('T')[0]] }
        },
        order: [['date', 'DESC']]
      });
      exportData.journal = journalEntries;
    }
    
    // Export reminders
    if (!categories || categories.includes('reminders')) {
      const reminders = await Reminder.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']]
      });
      exportData.reminders = reminders;
    }
    
    // Export chat conversations
    if (!categories || categories.includes('chat')) {
      const conversations = await Conversation.findAll({
        where: { userId },
        include: [{
          model: Message,
          as: 'messages',
          order: [['createdAt', 'ASC']]
        }],
        order: [['createdAt', 'DESC']]
      });
      exportData.conversations = conversations;
    }
    
    // Add metadata
    exportData.exportInfo = {
      exportedAt: new Date().toISOString(),
      userId: userId,
      dateRange: { startDate: start.toISOString(), endDate: end.toISOString() },
      categories: categories || ['all'],
      version: '1.0'
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="health-data-${new Date().toISOString().split('T')[0]}.json"`);
    res.json(exportData);
  } catch (error) {
    console.error('Error exporting JSON data:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Export user data in CSV format
router.post('/csv', auth, async (req, res) => {
  try {
    const { categories, startDate, endDate } = req.body;
    const userId = req.user.id;
    
    const start = startDate ? new Date(startDate) : new Date('2020-01-01');
    const end = endDate ? new Date(endDate) : new Date();
    
    let csvData = '';
    
    // Export assessments as CSV
    if (!categories || categories.includes('assessments')) {
      const assessments = await AssessmentResult.findAll({
        where: { 
          userId,
          createdAt: { [Op.between]: [start, end] }
        },
        order: [['createdAt', 'DESC']]
      });
      
      if (assessments.length > 0) {
        csvData += 'ASSESSMENTS\n';
        csvData += 'Date,Form Title,Score,Responses\n';
        
        assessments.forEach(assessment => {
          const responses = JSON.stringify(assessment.responses || {});
          csvData += `${assessment.createdAt.toISOString().split('T')[0]},${assessment.formTitle || 'Unknown'},${assessment.score || 0},"${responses.replace(/"/g, '""')}"\n`;
        });
        csvData += '\n';
      }
    }
    
    // Export goals as CSV
    if (!categories || categories.includes('goals')) {
      const goals = await HealthGoal.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']]
      });
      
      if (goals.length > 0) {
        csvData += 'HEALTH GOALS\n';
        csvData += 'Title,Description,Category,Target Date,Progress,Status,Created\n';
        
        goals.forEach(goal => {
          const status = goal.progress >= 100 ? 'Completed' : goal.progress > 0 ? 'In Progress' : 'Not Started';
          csvData += `"${goal.title}","${goal.description || ''}","${goal.category || ''}","${goal.targetDate || ''}",${goal.progress || 0},${status},${goal.createdAt.toISOString().split('T')[0]}\n`;
        });
        csvData += '\n';
      }
    }
    
    // Export symptoms as CSV
    if (!categories || categories.includes('symptoms')) {
      const symptoms = await Symptom.findAll({
        where: { 
          userId,
          createdAt: { [Op.between]: [start, end] }
        },
        order: [['createdAt', 'DESC']]
      });
      
      if (symptoms.length > 0) {
        csvData += 'SYMPTOMS\n';
        csvData += 'Date,Symptom,Severity,Category,Notes,Duration\n';
        
        symptoms.forEach(symptom => {
          csvData += `${symptom.createdAt.toISOString().split('T')[0]},"${symptom.name}","${symptom.severity || ''}","${symptom.category || ''}","${symptom.notes || ''}","${symptom.duration || ''}"\n`;
        });
        csvData += '\n';
      }
    }
    
    // Export medications as CSV
    if (!categories || categories.includes('medications')) {
      const medications = await Medication.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']]
      });
      
      if (medications.length > 0) {
        csvData += 'MEDICATIONS\n';
        csvData += 'Name,Dosage,Frequency,Start Date,End Date,Notes,Status\n';
        
        medications.forEach(medication => {
          const status = medication.isActive ? 'Active' : 'Inactive';
          csvData += `"${medication.name}","${medication.dosage || ''}","${medication.frequency || ''}","${medication.startDate || ''}","${medication.endDate || ''}","${medication.notes || ''}",${status}\n`;
        });
        csvData += '\n';
      }
    }
    
    // Export journal entries as CSV
    if (!categories || categories.includes('journal')) {
      const journalEntries = await JournalEntry.findAll({
        where: { 
          userId,
          date: { [Op.between]: [startDate || '2020-01-01', endDate || new Date().toISOString().split('T')[0]] }
        },
        order: [['date', 'DESC']]
      });
      
      if (journalEntries.length > 0) {
        csvData += 'JOURNAL ENTRIES\n';
        csvData += 'Date,Mood,Energy,Sleep,Exercise,Water,Stress,Notes\n';
        
        journalEntries.forEach(entry => {
          csvData += `${entry.date},"${entry.mood || ''}","${entry.energy || ''}","${entry.sleep || ''}","${entry.exercise || ''}","${entry.water || ''}","${entry.stress || ''}","${(entry.notes || '').replace(/"/g, '""')}"\n`;
        });
        csvData += '\n';
      }
    }
    
    // Add metadata
    csvData += 'EXPORT INFO\n';
    csvData += 'Exported At,User ID,Date Range Start,Date Range End,Categories\n';
    csvData += `${new Date().toISOString()},${userId},${start.toISOString().split('T')[0]},${end.toISOString().split('T')[0]},"${(categories || ['all']).join(', ')}"\n`;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="health-data-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csvData);
  } catch (error) {
    console.error('Error exporting CSV data:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Export user data summary for PDF generation
router.post('/pdf-data', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const userId = req.user.id;
    
    const start = startDate ? new Date(startDate) : new Date('2020-01-01');
    const end = endDate ? new Date(endDate) : new Date();
    
    // Fetch all data for PDF generation
    const [
      user,
      assessments,
      goals,
      symptoms,
      medications,
      journalEntries,
      reminders,
      conversations
    ] = await Promise.all([
      User.findByPk(userId, {
        attributes: { exclude: ['password'] }
      }),
      AssessmentResult.findAll({
        where: { 
          userId,
          createdAt: { [Op.between]: [start, end] }
        },
        order: [['createdAt', 'DESC']]
      }),
      HealthGoal.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']]
      }),
      Symptom.findAll({
        where: { 
          userId,
          createdAt: { [Op.between]: [start, end] }
        },
        order: [['createdAt', 'DESC']]
      }),
      Medication.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']]
      }),
      JournalEntry.findAll({
        where: { 
          userId,
          date: { [Op.between]: [startDate || '2020-01-01', endDate || new Date().toISOString().split('T')[0]] }
        },
        order: [['date', 'DESC']]
      }),
      Reminder.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']]
      }),
      Conversation.findAll({
        where: { userId },
        include: [{
          model: Message,
          as: 'messages',
          limit: 10,
          order: [['createdAt', 'DESC']]
        }],
        order: [['createdAt', 'DESC']],
        limit: 5
      })
    ]);
    
    // Generate summary statistics
    const summary = {
      totalAssessments: assessments.length,
      totalGoals: goals.length,
      completedGoals: goals.filter(g => g.progress >= 100).length,
      totalSymptoms: symptoms.length,
      totalMedications: medications.length,
      totalJournalEntries: journalEntries.length,
      totalReminders: reminders.length,
      activeReminders: reminders.filter(r => r.isActive).length,
      totalConversations: conversations.length
    };
    
    // Calculate health metrics
    const healthMetrics = {
      avgMood: journalEntries.length > 0 
        ? journalEntries.reduce((sum, j) => sum + (j.mood || 0), 0) / journalEntries.length 
        : 0,
      avgEnergy: journalEntries.length > 0 
        ? journalEntries.reduce((sum, j) => sum + (j.energy || 0), 0) / journalEntries.length 
        : 0,
      avgSleep: journalEntries.length > 0 
        ? journalEntries.reduce((sum, j) => sum + (j.sleep || 0), 0) / journalEntries.length 
        : 0,
      avgExercise: journalEntries.length > 0 
        ? journalEntries.reduce((sum, j) => sum + (j.exercise || 0), 0) / journalEntries.length 
        : 0,
      avgHydration: journalEntries.length > 0 
        ? journalEntries.reduce((sum, j) => sum + (j.water || 0), 0) / journalEntries.length 
        : 0
    };
    
    const pdfData = {
      user,
      summary,
      healthMetrics,
      assessments,
      goals,
      symptoms,
      medications,
      journalEntries,
      reminders,
      conversations,
      exportInfo: {
        exportedAt: new Date().toISOString(),
        dateRange: { startDate: start.toISOString(), endDate: end.toISOString() },
        version: '1.0'
      }
    };
    
    res.json(pdfData);
  } catch (error) {
    console.error('Error preparing PDF data:', error);
    res.status(500).json({ error: 'Failed to prepare PDF data' });
  }
});

// Get available export categories
router.get('/categories', auth, (req, res) => {
  const categories = [
    {
      id: 'profile',
      name: 'Profile Information',
      description: 'User profile and account information'
    },
    {
      id: 'assessments',
      name: 'Health Assessments',
      description: 'All completed health assessment results'
    },
    {
      id: 'goals',
      name: 'Health Goals',
      description: 'Health goals and progress tracking'
    },
    {
      id: 'symptoms',
      name: 'Symptom Logs',
      description: 'Recorded symptoms and health observations'
    },
    {
      id: 'medications',
      name: 'Medications',
      description: 'Medication tracking and reminders'
    },
    {
      id: 'journal',
      name: 'Health Journal',
      description: 'Daily health journal entries'
    },
    {
      id: 'reminders',
      name: 'Reminders',
      description: 'Health reminders and notifications'
    },
    {
      id: 'chat',
      name: 'Chat History',
      description: 'Conversations with AI health assistant'
    }
  ];
  
  res.json(categories);
});

module.exports = router;

