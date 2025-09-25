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

// API Routes (to be implemented)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/assessment', require('./routes/assessment'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, async () => {
  console.log(`🚀 Khisha API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  await testConnection();
  await sequelize.sync();
  // Seed one sample assessment form if none exist
  const count = await AssessmentForm.count();
  if (count === 0) {
    await AssessmentForm.create({
      title: 'General Wellness Check',
      description: 'Basic 3-question wellness check.',
      questions: [
        { id: 'q1', type: 'scale', label: 'Energy level today', min: 1, max: 5 },
        { id: 'q2', type: 'scale', label: 'Mood level today', min: 1, max: 5 },
        { id: 'q3', type: 'text', label: 'Any health concern?' }
      ]
    });
    console.log('🌱 Seeded sample assessment form');
  }
  console.log('🗄️  Database synchronized');
});
