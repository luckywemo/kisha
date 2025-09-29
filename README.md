# 🏥 Khisha Health - Comprehensive Health Assessment Platform

Khisha Health is a modern, full-stack health assessment and wellness tracking application built with React, Node.js, and SQLite. It provides users with comprehensive health monitoring, AI-powered health advice, and detailed analytics.

## ✨ Features

### 🎯 Core Features
- **Health Assessments** - Interactive forms for wellness evaluation
- **AI Health Chat** - Intelligent health assistant for personalized advice
- **Symptom Tracking** - Log and monitor health symptoms with severity ratings
- **Medication Management** - Track medications, dosages, and reminders
- **Health Goals** - Set and track wellness objectives with progress monitoring
- **Health Journal** - Daily wellness logging with mood, energy, and activity tracking

### 📊 Analytics & Reporting
- **Health Analytics** - Comprehensive health data analysis and insights
- **Health Reports** - Generate detailed health reports in multiple formats
- **Trend Analysis** - Track health improvements over time
- **Personalized Recommendations** - AI-driven health suggestions

### 🏆 Gamification
- **Health Challenges** - Participate in wellness challenges
- **Achievement System** - Unlock badges and rewards
- **Progress Tracking** - Monitor streaks and completion rates
- **Leaderboards** - Compare progress with other users

### 🔔 Smart Features
- **Reminder System** - Medication and health activity reminders
- **Data Export** - Export health data in JSON, CSV, and PDF formats
- **Wellness Tips** - Personalized health recommendations
- **Notification System** - Browser notifications for important health events

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with hooks and functional components
- **React Router** - Client-side routing
- **CSS3** - Custom styling with CSS variables and modern layouts
- **Vite** - Fast development server and build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **SQLite** - Lightweight database with Sequelize ORM
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing

### Security & Performance
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API request throttling
- **Input Validation** - Comprehensive data validation

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd khisha
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies (root, backend, frontend)
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Start the application**

   **Windows:**
   ```bash
   start.bat
   ```

   **Linux/Mac:**
   ```bash
   ./start.sh
   ```

   **Manual start:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

## 📱 Application Structure

### Frontend Pages
- **Dashboard** - Overview of health metrics and quick actions
- **Health Chat** - AI-powered health assistant conversations
- **Assessments** - Interactive health assessment forms
- **Analytics** - Health data visualization and insights
- **Goals** - Health goal setting and progress tracking
- **Symptoms** - Symptom logging and tracking
- **Medications** - Medication management and reminders
- **Journal** - Daily health and wellness logging
- **Tips** - Personalized wellness recommendations
- **Challenges** - Health challenges and achievements
- **Reports** - Comprehensive health reports
- **Reminders** - Health activity reminders
- **Export** - Data export functionality
- **Profile** - User account management

### Backend API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

#### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

#### Health Assessments
- `GET /api/assessment/forms` - Get available assessment forms
- `POST /api/assessment/submit` - Submit assessment responses
- `GET /api/assessment/results/:id` - Get assessment results

#### Chat System
- `GET /api/chat/conversations` - Get user conversations
- `POST /api/chat/conversations` - Create new conversation
- `POST /api/chat/messages` - Send message
- `GET /api/chat/conversations/:id/messages` - Get conversation messages

#### Health Management
- `GET /api/goals` - Get health goals
- `POST /api/goals` - Create health goal
- `PUT /api/goals/:id` - Update health goal
- `DELETE /api/goals/:id` - Delete health goal

- `GET /api/symptoms` - Get symptoms
- `POST /api/symptoms` - Log symptom
- `PUT /api/symptoms/:id` - Update symptom
- `DELETE /api/symptoms/:id` - Delete symptom

- `GET /api/medications` - Get medications
- `POST /api/medications` - Add medication
- `PUT /api/medications/:id` - Update medication
- `DELETE /api/medications/:id` - Delete medication
- `POST /api/medications/:id/taken` - Mark medication as taken

- `GET /api/journal` - Get journal entries
- `POST /api/journal` - Create journal entry
- `PUT /api/journal/:id` - Update journal entry
- `DELETE /api/journal/:id` - Delete journal entry

## 🗄️ Database Schema

### Core Tables
- **Users** - User accounts and profiles
- **AssessmentForms** - Health assessment templates
- **AssessmentSubmissions** - User assessment responses
- **Conversations** - Chat conversations
- **Messages** - Chat messages
- **Medications** - Medication records
- **HealthGoals** - User health goals
- **Symptoms** - Symptom logs
- **JournalEntries** - Daily health journal entries

### Relationships
- Users have many conversations, assessments, medications, goals, symptoms, and journal entries
- AssessmentForms have many submissions
- Conversations have many messages

## 🎨 Design System

### Color Palette
- **Primary Blue**: #3b82f6
- **Success Green**: #10b981
- **Warning Orange**: #f59e0b
- **Error Red**: #ef4444
- **Neutral Gray**: #6b7280

### Typography
- **Primary Font**: System font stack
- **Headings**: Bold weights (600-700)
- **Body Text**: Regular weight (400-500)

### Components
- **Cards** - Consistent card-based layout
- **Buttons** - Primary and secondary button styles
- **Forms** - Accessible form components
- **Badges** - Status and category indicators
- **Dashboard Grid** - Responsive grid system

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for secure password storage
- **Rate Limiting** - API request throttling
- **CORS Protection** - Cross-origin request security
- **Input Validation** - Comprehensive data validation
- **SQL Injection Protection** - Sequelize ORM protection
- **XSS Protection** - Helmet security headers

## 📊 Health Assessment Types

1. **General Wellness Check** - Overall health status evaluation
2. **Sleep Quality Assessment** - Sleep patterns and quality analysis
3. **Stress Level Assessment** - Stress management evaluation
4. **Physical Activity Assessment** - Exercise and fitness tracking
5. **Nutrition Assessment** - Dietary habits and nutrition awareness

## 🤖 AI Health Assistant

The AI health assistant provides intelligent responses for:
- **Symptom Analysis** - Headaches, fatigue, pain management
- **Sleep Guidance** - Sleep hygiene and improvement tips
- **Stress Management** - Relaxation techniques and coping strategies
- **Exercise Advice** - Fitness recommendations and safety tips
- **Nutrition Guidance** - Healthy eating habits and meal planning
- **Mental Health Support** - Mood tracking and wellness strategies
- **General Health Tips** - Preventive care and lifestyle advice

## 📈 Analytics & Insights

### Health Metrics Tracked
- **Mood Levels** - Daily mood ratings (1-10 scale)
- **Energy Levels** - Energy tracking throughout the day
- **Sleep Quality** - Sleep duration and quality metrics
- **Exercise Activity** - Physical activity tracking
- **Stress Levels** - Stress monitoring and management
- **Hydration** - Water intake tracking
- **Symptom Severity** - Symptom intensity and frequency

### Report Types
- **Weekly Wellness Summary** - 7-day health overview
- **Monthly Health Trends** - 30-day trend analysis
- **Assessment Progress Report** - Assessment improvement tracking
- **Sleep Quality Analysis** - Detailed sleep pattern analysis
- **Exercise Performance Report** - Fitness activity summary
- **Mental Health Insights** - Mood and stress analysis
- **Nutrition & Diet Report** - Eating habits evaluation
- **Comprehensive Health Profile** - Complete health overview

## 🏆 Achievement System

### Achievement Categories
- **First Steps** - Complete first health assessment
- **Chat Master** - Engage with health assistant
- **Streak Keeper** - Maintain journaling consistency
- **Assessment Pro** - Complete multiple assessments
- **Wellness Warrior** - Complete health challenges
- **Health Guru** - Reach advanced wellness levels

### Challenge Types
- **Hydration Challenge** - Daily water intake goals
- **Fitness Streak** - Consistent exercise routine
- **Mindful Morning** - Daily meditation practice
- **Sleep Improvement** - Consistent sleep schedule
- **Healthy Meal Prep** - Home-cooked meal planning
- **Digital Detox** - Screen time reduction

## 📤 Data Export Features

### Export Formats
- **JSON** - Complete data export for analysis
- **CSV** - Spreadsheet-compatible format
- **PDF** - Professional health reports

### Exportable Data
- Health assessments and scores
- Chat conversation history
- Symptom logs and patterns
- Medication records
- Health goals and progress
- Journal entries and metrics

## 🔧 Development

### Available Scripts

**Root Level:**
```bash
npm install          # Install all dependencies
```

**Backend:**
```bash
npm run dev          # Start development server
npm start            # Start production server
```

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your-secret-key-here
CORS_ORIGINS=http://localhost:5173
```

### Database

The application uses SQLite for development and can be easily configured for production databases like PostgreSQL or MySQL.

## 🚀 Deployment

### Docker Deployment

1. **Build the application:**
   ```bash
   docker-compose up --build
   ```

2. **Production deployment:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Manual Deployment

1. **Build frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start backend:**
   ```bash
   cd backend
   npm start
   ```

3. **Serve frontend** using a web server like Nginx or Apache

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js community for the robust backend framework
- SQLite for the lightweight database solution
- All open-source contributors who made this possible

## 📞 Support

For support, email support@khisha-health.com or join our community Discord server.

---

**Built with ❤️ for better health and wellness**