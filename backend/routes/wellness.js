const express = require('express');
const { sequelize } = require('../db/config');
const { WellnessTip, User } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Get wellness tips with filtering
router.get('/', auth, async (req, res) => {
  try {
    const { category, limit = 20, offset = 0 } = req.query;
    const userId = req.user.id;
    
    const whereClause = { isActive: true };
    if (category && category !== 'all') {
      whereClause.category = category;
    }
    
    const tips = await WellnessTip.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    // Get user's health data for personalized recommendations
    const userHealthData = await getUserHealthData(userId);
    const personalizedTips = personalizeTips(tips, userHealthData);
    
    res.json(personalizedTips);
  } catch (error) {
    console.error('Error fetching wellness tips:', error);
    res.status(500).json({ error: 'Failed to fetch wellness tips' });
  }
});

// Get wellness tip categories
router.get('/categories', auth, (req, res) => {
  const categories = [
    { id: 'nutrition', name: 'Nutrition', icon: '🥗', color: '#f59e0b' },
    { id: 'fitness', name: 'Fitness', icon: '🏃‍♂️', color: '#10b981' },
    { id: 'sleep', name: 'Sleep', icon: '😴', color: '#8b5cf6' },
    { id: 'mental-health', name: 'Mental Health', icon: '🧘‍♀️', color: '#06b6d4' },
    { id: 'stress-management', name: 'Stress Management', icon: '🌿', color: '#22c55e' },
    { id: 'hydration', name: 'Hydration', icon: '💧', color: '#3b82f6' },
    { id: 'meditation', name: 'Meditation', icon: '🕉️', color: '#84cc16' },
    { id: 'general', name: 'General Wellness', icon: '✨', color: '#6366f1' }
  ];
  
  res.json(categories);
});

// Get personalized wellness recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's recent health data
    const healthData = await getUserHealthData(userId);
    
    // Generate personalized recommendations based on health data
    const recommendations = await generatePersonalizedRecommendations(healthData);
    
    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching personalized recommendations:', error);
    res.status(500).json({ error: 'Failed to fetch personalized recommendations' });
  }
});

// Create a new wellness tip (admin functionality)
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      tags,
      difficulty,
      estimatedTime,
      benefits,
      instructions
    } = req.body;
    
    const tip = await WellnessTip.create({
      title,
      content,
      category,
      tags: tags || [],
      difficulty: difficulty || 'beginner',
      estimatedTime: estimatedTime || '5 minutes',
      benefits: benefits || [],
      instructions: instructions || [],
      createdBy: req.user.id,
      isActive: true
    });
    
    res.status(201).json(tip);
  } catch (error) {
    console.error('Error creating wellness tip:', error);
    res.status(500).json({ error: 'Failed to create wellness tip' });
  }
});

// Get wellness tip by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const tip = await WellnessTip.findByPk(id);
    
    if (!tip) {
      return res.status(404).json({ error: 'Wellness tip not found' });
    }
    
    res.json(tip);
  } catch (error) {
    console.error('Error fetching wellness tip:', error);
    res.status(500).json({ error: 'Failed to fetch wellness tip' });
  }
});

// Get daily wellness tip
router.get('/daily/tip', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's health data for personalized daily tip
    const healthData = await getUserHealthData(userId);
    
    // Get a random tip from the most relevant category
    const relevantCategory = getRelevantCategory(healthData);
    
    const tip = await WellnessTip.findOne({
      where: { 
        category: relevantCategory,
        isActive: true 
      },
      order: [sequelize.fn('RANDOM')]
    });
    
    if (!tip) {
      // Fallback to general category
      const fallbackTip = await WellnessTip.findOne({
        where: { 
          category: 'general',
          isActive: true 
        },
        order: [sequelize.fn('RANDOM')]
      });
      
      return res.json(fallbackTip);
    }
    
    res.json(tip);
  } catch (error) {
    console.error('Error fetching daily tip:', error);
    res.status(500).json({ error: 'Failed to fetch daily tip' });
  }
});

// Helper function to get user's health data
async function getUserHealthData(userId) {
  try {
    const { 
      JournalEntry, 
      AssessmentSubmission, 
      Symptom, 
      HealthGoal,
      Reminder 
    } = require('../models');
    
    const { Op } = require('sequelize');
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const [
      recentJournalEntries,
      recentAssessments,
      recentSymptoms,
      activeGoals,
      activeReminders
    ] = await Promise.all([
      JournalEntry.findAll({
        where: { 
          userId,
          date: { [Op.gte]: thirtyDaysAgo.toISOString().split('T')[0] }
        },
        order: [['date', 'DESC']],
        limit: 30
      }),
      AssessmentSubmission.findAll({
        where: { 
          userId,
          createdAt: { [Op.gte]: thirtyDaysAgo }
        },
        order: [['createdAt', 'DESC']],
        limit: 10
      }),
      Symptom.findAll({
        where: { 
          userId,
          createdAt: { [Op.gte]: thirtyDaysAgo }
        },
        order: [['createdAt', 'DESC']],
        limit: 20
      }),
      HealthGoal.findAll({
        where: { userId, progress: { [Op.lt]: 100 } },
        order: [['createdAt', 'DESC']]
      }),
      Reminder.findAll({
        where: { userId, isActive: true },
        order: [['createdAt', 'DESC']]
      })
    ]);
    
    return {
      journalEntries: recentJournalEntries,
      assessments: recentAssessments,
      symptoms: recentSymptoms,
      goals: activeGoals,
      reminders: activeReminders
    };
  } catch (error) {
    console.error('Error fetching user health data:', error);
    return {
      journalEntries: [],
      assessments: [],
      symptoms: [],
      goals: [],
      reminders: []
    };
  }
}

// Helper function to personalize tips based on user data
function personalizeTips(tips, healthData) {
  return tips.map(tip => {
    let relevanceScore = 0;
    let personalizedContent = tip.content;
    
    // Analyze user's health patterns and adjust tip relevance
    if (healthData.journalEntries.length > 0) {
      const avgMood = healthData.journalEntries.reduce((sum, entry) => sum + (entry.mood || 0), 0) / healthData.journalEntries.length;
      const avgSleep = healthData.journalEntries.reduce((sum, entry) => sum + (entry.sleep || 0), 0) / healthData.journalEntries.length;
      const avgEnergy = healthData.journalEntries.reduce((sum, entry) => sum + (entry.energy || 0), 0) / healthData.journalEntries.length;
      
      // Increase relevance for tips matching user's needs
      if (tip.category === 'mental-health' && avgMood < 6) relevanceScore += 3;
      if (tip.category === 'sleep' && avgSleep < 7) relevanceScore += 3;
      if (tip.category === 'fitness' && avgEnergy < 6) relevanceScore += 2;
    }
    
    // Check for relevant symptoms
    if (healthData.symptoms.length > 0) {
      const symptomCategories = healthData.symptoms.map(s => s.category);
      if (tip.category === 'nutrition' && symptomCategories.includes('digestive')) relevanceScore += 2;
      if (tip.category === 'stress-management' && symptomCategories.includes('mental')) relevanceScore += 2;
    }
    
    // Check for relevant goals
    if (healthData.goals.length > 0) {
      const goalCategories = healthData.goals.map(g => g.category);
      if (goalCategories.includes(tip.category)) relevanceScore += 1;
    }
    
    return {
      ...tip.toJSON(),
      relevanceScore,
      personalizedContent,
      isPersonalized: relevanceScore > 2
    };
  }).sort((a, b) => b.relevanceScore - a.relevanceScore);
}

// Helper function to get relevant category based on health data
function getRelevantCategory(healthData) {
  if (healthData.journalEntries.length === 0) return 'general';
  
  const avgMood = healthData.journalEntries.reduce((sum, entry) => sum + (entry.mood || 0), 0) / healthData.journalEntries.length;
  const avgSleep = healthData.journalEntries.reduce((sum, entry) => sum + (entry.sleep || 0), 0) / healthData.journalEntries.length;
  const avgEnergy = healthData.journalEntries.reduce((sum, entry) => sum + (entry.energy || 0), 0) / healthData.journalEntries.length;
  
  // Prioritize categories based on user's needs
  if (avgMood < 6) return 'mental-health';
  if (avgSleep < 7) return 'sleep';
  if (avgEnergy < 6) return 'fitness';
  if (healthData.symptoms.some(s => s.category === 'digestive')) return 'nutrition';
  if (healthData.symptoms.some(s => s.category === 'mental')) return 'stress-management';
  
  return 'general';
}

// Helper function to generate personalized recommendations
async function generatePersonalizedRecommendations(healthData) {
  const recommendations = [];
  
  // Analyze journal entries for patterns
  if (healthData.journalEntries.length > 0) {
    const avgMood = healthData.journalEntries.reduce((sum, entry) => sum + (entry.mood || 0), 0) / healthData.journalEntries.length;
    const avgSleep = healthData.journalEntries.reduce((sum, entry) => sum + (entry.sleep || 0), 0) / healthData.journalEntries.length;
    const avgEnergy = healthData.journalEntries.reduce((sum, entry) => sum + (entry.energy || 0), 0) / healthData.journalEntries.length;
    const avgHydration = healthData.journalEntries.reduce((sum, entry) => sum + (entry.water || 0), 0) / healthData.journalEntries.length;
    
    if (avgMood < 6) {
      recommendations.push({
        category: 'mental-health',
        priority: 'high',
        title: 'Improve Your Mood',
        description: 'Your mood has been lower than average. Consider these strategies to boost your mental well-being.',
        tips: [
          'Practice gratitude journaling daily',
          'Engage in activities you enjoy',
          'Connect with friends and family',
          'Consider meditation or mindfulness practices'
        ]
      });
    }
    
    if (avgSleep < 7) {
      recommendations.push({
        category: 'sleep',
        priority: 'high',
        title: 'Optimize Your Sleep',
        description: 'Your sleep duration could be improved. Here are some tips for better rest.',
        tips: [
          'Maintain a consistent bedtime routine',
          'Avoid screens 1 hour before bed',
          'Keep your bedroom cool and dark',
          'Limit caffeine after 2 PM'
        ]
      });
    }
    
    if (avgEnergy < 6) {
      recommendations.push({
        category: 'fitness',
        priority: 'medium',
        title: 'Boost Your Energy',
        description: 'Your energy levels could use a boost. Try these strategies.',
        tips: [
          'Take short walks throughout the day',
          'Stay hydrated with water',
          'Get regular exercise',
          'Ensure you\'re getting enough sleep'
        ]
      });
    }
    
    if (avgHydration < 8) {
      recommendations.push({
        category: 'hydration',
        priority: 'medium',
        title: 'Increase Water Intake',
        description: 'You could benefit from drinking more water throughout the day.',
        tips: [
          'Start your day with a glass of water',
          'Set hourly reminders to drink water',
          'Add fruits to your water for flavor',
          'Carry a water bottle with you'
        ]
      });
    }
  }
  
  // Analyze symptoms for recommendations
  if (healthData.symptoms.length > 0) {
    const symptomCategories = healthData.symptoms.map(s => s.category);
    const uniqueCategories = [...new Set(symptomCategories)];
    
    if (uniqueCategories.includes('mental')) {
      recommendations.push({
        category: 'stress-management',
        priority: 'high',
        title: 'Manage Stress and Anxiety',
        description: 'You\'ve been experiencing mental health symptoms. Consider these stress management techniques.',
        tips: [
          'Practice deep breathing exercises',
          'Try progressive muscle relaxation',
          'Engage in regular physical activity',
          'Consider speaking with a mental health professional'
        ]
      });
    }
  }
  
  // Analyze goals for recommendations
  if (healthData.goals.length > 0) {
    const incompleteGoals = healthData.goals.filter(g => g.progress < 100);
    
    if (incompleteGoals.length > 0) {
      recommendations.push({
        category: 'general',
        priority: 'medium',
        title: 'Focus on Your Goals',
        description: 'You have some health goals that could use more attention.',
        tips: [
          'Break large goals into smaller, manageable steps',
          'Set daily reminders for goal-related activities',
          'Track your progress regularly',
          'Celebrate small wins along the way'
        ]
      });
    }
  }
  
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

module.exports = router;

