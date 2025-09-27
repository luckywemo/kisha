import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

export default function Home() {
  const [stats, setStats] = useState({
    assessmentsCompleted: 0,
    conversationsCount: 0,
    lastAssessment: null,
    healthScore: 0
  });
  const [loading, setLoading] = useState(true);
  const [healthProgress, setHealthProgress] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const [formsRes, conversationsRes] = await Promise.all([
        api.listForms().catch(() => ({ forms: [] })),
        api.listConversations().catch(() => ({ conversations: [] }))
      ]);

      // Calculate stats
      const assessmentsCompleted = formsRes.forms?.length || 0;
      const conversationsCount = conversationsRes.conversations?.length || 0;
      
      // Mock health score calculation (in real app, this would be based on assessment data)
      const healthScore = Math.floor(Math.random() * 40) + 60; // 60-100 range

      setStats({
        assessmentsCompleted,
        conversationsCount,
        lastAssessment: formsRes.forms?.[0] || null,
        healthScore
      });

      // Generate mock health progress data
      generateHealthProgress();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  function generateHealthProgress() {
    // Generate mock progress data for the last 7 days
    const progress = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      progress.push({
        date: date.toISOString().split('T')[0],
        energy: Math.floor(Math.random() * 40) + 60,
        mood: Math.floor(Math.random() * 40) + 60,
        sleep: Math.floor(Math.random() * 30) + 70,
        exercise: Math.floor(Math.random() * 50) + 50
      });
    }
    
    setHealthProgress(progress);
  }

  const dashboardCards = [
    {
      title: 'Health Score',
      value: stats.healthScore,
      unit: '/100',
      icon: '💚',
      color: 'success',
      description: 'Your overall wellness rating'
    },
    {
      title: 'Assessments',
      value: stats.assessmentsCompleted,
      unit: 'completed',
      icon: '📋',
      color: 'primary',
      description: 'Health assessments taken'
    },
    {
      title: 'Chat Sessions',
      value: stats.conversationsCount,
      unit: 'conversations',
      icon: '💬',
      color: 'warning',
      description: 'Health chat interactions'
    },
    {
      title: 'Last Check-in',
      value: stats.lastAssessment ? 'Recent' : 'None',
      unit: '',
      icon: '⏰',
      color: stats.lastAssessment ? 'success' : 'error',
      description: stats.lastAssessment ? 'Assessment completed recently' : 'No recent assessments'
    }
  ];

  const quickActions = [
    {
      title: 'Take Health Assessment',
      description: 'Complete a wellness check to track your health status',
      icon: '📋',
      link: '/assessment',
      color: 'primary'
    },
    {
      title: 'Start Health Chat',
      description: 'Get personalized health advice and recommendations',
      icon: '💬',
      link: '/chat',
      color: 'success'
    },
    {
      title: 'View Profile',
      description: 'Manage your account settings and preferences',
      icon: '👤',
      link: '/profile',
      color: 'warning'
    }
  ];

  const healthTips = [
    {
      title: 'Stay Hydrated',
      description: 'Drink at least 8 glasses of water daily for optimal health',
      icon: '💧'
    },
    {
      title: 'Regular Exercise',
      description: 'Aim for 30 minutes of moderate activity most days',
      icon: '🏃‍♂️'
    },
    {
      title: 'Quality Sleep',
      description: 'Get 7-9 hours of sleep for better recovery and health',
      icon: '😴'
    },
    {
      title: 'Mindful Eating',
      description: 'Focus on whole foods and balanced nutrition',
      icon: '🥗'
    }
  ];

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center" style={{ minHeight: '200px' }}>
          <div className="loading"></div>
          <span style={{ marginLeft: '1rem' }}>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="card mb-6">
        <div className="card-header">
          <h1 className="card-title">Welcome to Khisha Health</h1>
          <p className="text-muted">
            Your personal health companion for tracking wellness and getting expert guidance
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-grid">
        {dashboardCards.map((card, index) => (
          <div key={index} className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">{card.title}</h3>
              <div className={`dashboard-card-icon ${card.color}`}>
                {card.icon}
              </div>
            </div>
            <div className="dashboard-card-value">
              {card.value}
              {card.unit && <span className="text-muted" style={{ fontSize: '1rem', fontWeight: 'normal' }}>{card.unit}</span>}
            </div>
            <p className="dashboard-card-content">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="card-title">Quick Actions</h2>
          <p className="text-muted">Get started with these health features</p>
        </div>
        <div className="dashboard-grid">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link} className="dashboard-card" style={{ textDecoration: 'none' }}>
              <div className="dashboard-card-header">
                <h3 className="dashboard-card-title">{action.title}</h3>
                <div className={`dashboard-card-icon ${action.color}`}>
                  {action.icon}
                </div>
              </div>
              <p className="dashboard-card-content">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Health Progress Tracking */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="card-title">Health Progress</h2>
          <p className="text-muted">Track your wellness metrics over the last 7 days</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {['energy', 'mood', 'sleep', 'exercise'].map((metric) => (
            <div key={metric} className="dashboard-card">
              <div className="dashboard-card-header">
                <h3 className="dashboard-card-title" style={{ textTransform: 'capitalize' }}>
                  {metric === 'sleep' ? 'Sleep Quality' : `${metric} Level`}
                </h3>
                <div className="dashboard-card-icon primary">
                  {metric === 'energy' ? '⚡' : metric === 'mood' ? '😊' : metric === 'sleep' ? '😴' : '🏃‍♂️'}
                </div>
              </div>
              <div className="dashboard-card-value">
                {healthProgress.length > 0 ? healthProgress[healthProgress.length - 1][metric] : 0}
                <span className="text-muted" style={{ fontSize: '1rem', fontWeight: 'normal' }}>/100</span>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ 
                  height: '4px', 
                  backgroundColor: 'var(--bg-tertiary)', 
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${healthProgress.length > 0 ? healthProgress[healthProgress.length - 1][metric] : 0}%`,
                    backgroundColor: `var(--${healthProgress.length > 0 && healthProgress[healthProgress.length - 1][metric] > 70 ? 'success' : healthProgress.length > 0 && healthProgress[healthProgress.length - 1][metric] > 50 ? 'warning' : 'error'})`,
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
              <p className="dashboard-card-content" style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
                {healthProgress.length > 0 && healthProgress[healthProgress.length - 1][metric] > 70 ? 'Excellent!' : 
                 healthProgress.length > 0 && healthProgress[healthProgress.length - 1][metric] > 50 ? 'Good progress' : 
                 'Room for improvement'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Health Tips */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Health Tips</h2>
          <p className="text-muted">Daily wellness reminders for better health</p>
        </div>
        <div className="dashboard-grid">
          {healthTips.map((tip, index) => (
            <div key={index} className="dashboard-card">
              <div className="dashboard-card-header">
                <h3 className="dashboard-card-title">{tip.title}</h3>
                <div className="dashboard-card-icon primary">
                  {tip.icon}
                </div>
              </div>
              <p className="dashboard-card-content">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


