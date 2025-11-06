const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { errorHandler, notFoundHandler, requestId, errorLogger } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Import database and models after dotenv
const { sequelize, testConnection } = require('./db/config');
const { AssessmentForm, HealthChallenge, WellnessTip, User } = require('./models');
require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',');
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestId);

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Khisha Health Assessment API',
    version: '1.0.0',
    status: 'running'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/assessment', require('./routes/assessment'));
app.use('/api/medications', require('./routes/medications'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/symptoms', require('./routes/symptoms'));
app.use('/api/journal', require('./routes/journal'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/export', require('./routes/export'));
app.use('/api/challenges', require('./routes/challenges'));
app.use('/api/wellness', require('./routes/wellness'));

// Error handling middleware
app.use(errorLogger);
app.use(errorHandler);

// 404 handler
app.use(notFoundHandler);

app.listen(PORT, async () => {
  console.log(`🚀 Khisha API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  await testConnection();
  await sequelize.sync();
  // Seed sample assessment forms if none exist
  const count = await AssessmentForm.count();
  if (count === 0) {
    const sampleForms = [
      {
        title: 'General Wellness Check',
        description: 'Basic wellness assessment to track your overall health status.',
        questions: [
          { id: 'q1', type: 'scale', label: 'How is your energy level today?', min: 1, max: 5 },
          { id: 'q2', type: 'scale', label: 'How would you rate your mood?', min: 1, max: 5 },
          { id: 'q3', type: 'text', label: 'Any specific health concerns you\'d like to note?' }
        ]
      },
      {
        title: 'Sleep Quality Assessment',
        description: 'Evaluate your sleep patterns and quality to identify areas for improvement.',
        questions: [
          { id: 'q1', type: 'scale', label: 'How many hours did you sleep last night?', min: 3, max: 12 },
          { id: 'q2', type: 'scale', label: 'How would you rate your sleep quality?', min: 1, max: 5 },
          { id: 'q3', type: 'scale', label: 'How difficult was it to fall asleep?', min: 1, max: 5 },
          { id: 'q4', type: 'scale', label: 'How often did you wake up during the night?', min: 0, max: 5 },
          { id: 'q5', type: 'text', label: 'What factors do you think affect your sleep?' }
        ]
      },
      {
        title: 'Stress Level Assessment',
        description: 'Assess your current stress levels and identify stress management needs.',
        questions: [
          { id: 'q1', type: 'scale', label: 'How stressed do you feel today?', min: 1, max: 5 },
          { id: 'q2', type: 'scale', label: 'How well are you managing your stress?', min: 1, max: 5 },
          { id: 'q3', type: 'scale', label: 'How often do you feel overwhelmed?', min: 1, max: 5 },
          { id: 'q4', type: 'text', label: 'What are your main sources of stress?' },
          { id: 'q5', type: 'text', label: 'What stress management techniques do you currently use?' }
        ]
      },
      {
        title: 'Physical Activity Assessment',
        description: 'Track your physical activity levels and exercise habits.',
        questions: [
          { id: 'q1', type: 'scale', label: 'How many days per week do you exercise?', min: 0, max: 7 },
          { id: 'q2', type: 'scale', label: 'How would you rate your current fitness level?', min: 1, max: 5 },
          { id: 'q3', type: 'scale', label: 'How motivated do you feel to exercise?', min: 1, max: 5 },
          { id: 'q4', type: 'text', label: 'What types of physical activities do you enjoy?' },
          { id: 'q5', type: 'text', label: 'What barriers prevent you from exercising more?' }
        ]
      },
      {
        title: 'Nutrition Assessment',
        description: 'Evaluate your eating habits and nutritional awareness.',
        questions: [
          { id: 'q1', type: 'scale', label: 'How would you rate your overall diet quality?', min: 1, max: 5 },
          { id: 'q2', type: 'scale', label: 'How many servings of fruits and vegetables do you eat daily?', min: 0, max: 10 },
          { id: 'q3', type: 'scale', label: 'How often do you eat processed or fast food?', min: 1, max: 5 },
          { id: 'q4', type: 'scale', label: 'How well do you stay hydrated throughout the day?', min: 1, max: 5 },
          { id: 'q5', type: 'text', label: 'What are your main nutrition goals?' }
        ]
      }
    ];

    for (const form of sampleForms) {
      await AssessmentForm.create(form);
    }
    console.log(`🌱 Seeded ${sampleForms.length} sample assessment forms`);
  }

  // Seed a default user as creator for challenges/tips if needed
  let systemUser = await User.findOne({ where: { email: 'system@example.com' } });
  if (!systemUser) {
    systemUser = await User.create({ name: 'System', email: 'system@example.com', password: 'temporary' });
  }

  // Seed sample health challenges if none exist
  const challengeCount = await HealthChallenge.count();
  if (challengeCount === 0) {
    const sampleChallenges = [
      {
        title: '7-Day Hydration Boost',
        description: 'Drink at least 8 glasses of water daily for a week.',
        category: 'hydration',
        targetValue: 7,
        unit: 'days',
        duration: 7,
        points: 150,
        requirements: ['Log water intake daily'],
        tips: ['Carry a bottle', 'Set hourly reminders'],
        createdBy: systemUser.id,
        isActive: true
      },
      {
        title: 'Daily Step-Up',
        description: 'Walk 8,000 steps every day for 10 days.',
        category: 'fitness',
        targetValue: 10,
        unit: 'days',
        duration: 10,
        points: 200,
        requirements: ['Sync steps or log manually'],
        tips: ['Take stairs', 'Short walking breaks'],
        createdBy: systemUser.id,
        isActive: true
      },
      {
        title: 'Better Sleep Week',
        description: 'Get 7+ hours of sleep for 5 days in a week.',
        category: 'sleep',
        targetValue: 5,
        unit: 'days',
        duration: 7,
        points: 180,
        requirements: ['Log sleep daily'],
        tips: ['No screens 1h before bed', 'Consistent bedtime'],
        createdBy: systemUser.id,
        isActive: true
      }
    ];
    for (const ch of sampleChallenges) {
      await HealthChallenge.create(ch);
    }
    console.log(`🌱 Seeded ${sampleChallenges.length} sample health challenges`);
  }

  // Seed sample wellness tips if none exist
  const tipsCount = await WellnessTip.count();
  if (tipsCount === 0) {
    const sampleTips = [
      {
        title: 'Hydration Habit',
        content: 'Start your morning with a full glass of water to kickstart hydration.',
        category: 'hydration',
        tags: ['morning', 'routine'],
        difficulty: 'beginner',
        estimatedTime: '1 minute',
        benefits: ['Improved energy', 'Better focus'],
        instructions: ['Keep water by bedside', 'Drink upon waking'],
        createdBy: systemUser.id,
        isActive: true
      },
      {
        title: 'Wind-Down Routine',
        content: 'Dim lights and read for 15 minutes to signal your body to sleep.',
        category: 'sleep',
        tags: ['evening', 'routine'],
        difficulty: 'beginner',
        estimatedTime: '15 minutes',
        benefits: ['Faster sleep onset', 'Improved sleep quality'],
        instructions: ['Avoid screens', 'Set a consistent time'],
        createdBy: systemUser.id,
        isActive: true
      },
      {
        title: 'Box Breathing',
        content: 'Inhale 4s, hold 4s, exhale 4s, hold 4s. Repeat 4 times.',
        category: 'stress-management',
        tags: ['breathing', 'relaxation'],
        difficulty: 'beginner',
        estimatedTime: '2 minutes',
        benefits: ['Lower stress', 'Calmer mood'],
        instructions: ['Sit upright', 'Close eyes', 'Follow the counts'],
        createdBy: systemUser.id,
        isActive: true
      }
    ];
    for (const tip of sampleTips) {
      await WellnessTip.create(tip);
    }
    console.log(`🌱 Seeded ${sampleTips.length} wellness tips`);
  }
  console.log('🗄️  Database synchronized');
});
