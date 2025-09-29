const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { sequelize, testConnection } = require('./db/config');
const { AssessmentForm } = require('./models');
require('./models');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',');
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

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
  console.log('🗄️  Database synchronized');
});
