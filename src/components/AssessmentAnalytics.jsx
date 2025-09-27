import { useEffect, useState } from 'react'
import { api } from '../api'

export default function AssessmentAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalAssessments: 0,
    averageScore: 0,
    trends: [],
    insights: [],
    recommendations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      setLoading(true);
      // In a real app, this would fetch actual assessment data
      // For now, we'll generate mock analytics
      const mockAnalytics = generateMockAnalytics();
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  function generateMockAnalytics() {
    const trends = [];
    const today = new Date();
    
    // Generate 30 days of mock trend data
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      trends.push({
        date: date.toISOString().split('T')[0],
        score: Math.floor(Math.random() * 30) + 70,
        mood: Math.floor(Math.random() * 40) + 60,
        energy: Math.floor(Math.random() * 40) + 60,
        sleep: Math.floor(Math.random() * 30) + 70
      });
    }

    const totalAssessments = Math.floor(Math.random() * 20) + 10;
    const averageScore = Math.floor(Math.random() * 20) + 75;

    const insights = [
      {
        type: 'positive',
        title: 'Great Sleep Pattern',
        description: 'Your sleep quality has improved by 15% over the last week',
        icon: '😴'
      },
      {
        type: 'warning',
        title: 'Energy Levels Declining',
        description: 'Consider reviewing your exercise routine and nutrition',
        icon: '⚡'
      },
      {
        type: 'info',
        title: 'Consistent Mood',
        description: 'Your mood has been stable over the past month',
        icon: '😊'
      }
    ];

    const recommendations = [
      {
        category: 'Sleep',
        title: 'Improve Sleep Hygiene',
        description: 'Based on your assessments, focus on consistent bedtime routines',
        priority: 'high'
      },
      {
        category: 'Exercise',
        title: 'Increase Physical Activity',
        description: 'Consider adding 15 minutes of daily walking to boost energy',
        priority: 'medium'
      },
      {
        category: 'Nutrition',
        title: 'Hydration Check',
        description: 'Ensure you\'re drinking 8 glasses of water daily',
        priority: 'low'
      }
    ];

    return {
      totalAssessments,
      averageScore,
      trends,
      insights,
      recommendations
    };
  }

  function getTrendDirection(current, previous) {
    if (current > previous) return { direction: 'up', color: 'var(--success)' };
    if (current < previous) return { direction: 'down', color: 'var(--error)' };
    return { direction: 'stable', color: 'var(--text-muted)' };
  }

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center" style={{ minHeight: '200px' }}>
          <div className="loading"></div>
          <span style={{ marginLeft: '1rem' }}>Loading analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Overview Cards */}
      <div className="dashboard-grid mb-6">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Total Assessments</h3>
            <div className="dashboard-card-icon primary">📊</div>
          </div>
          <div className="dashboard-card-value">{analytics.totalAssessments}</div>
          <p className="dashboard-card-content">Health assessments completed</p>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Average Score</h3>
            <div className="dashboard-card-icon success">💯</div>
          </div>
          <div className="dashboard-card-value">{analytics.averageScore}</div>
          <p className="dashboard-card-content">Overall wellness rating</p>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Weekly Trend</h3>
            <div className="dashboard-card-icon warning">📈</div>
          </div>
          <div className="dashboard-card-value">
            {analytics.trends.length >= 7 ? 
              (() => {
                const current = analytics.trends[analytics.trends.length - 1].score;
                const previous = analytics.trends[analytics.trends.length - 8].score;
                const trend = getTrendDirection(current, previous);
                return (
                  <span style={{ color: trend.color }}>
                    {trend.direction === 'up' ? '↗️' : trend.direction === 'down' ? '↘️' : '➡️'} 
                    {Math.abs(current - previous)}
                  </span>
                );
              })() : 'N/A'
            }
          </div>
          <p className="dashboard-card-content">Score change this week</p>
        </div>
      </div>

      {/* Insights */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="card-title">Health Insights</h2>
          <p className="text-muted">AI-powered analysis of your health data</p>
        </div>
        <div className="dashboard-grid">
          {analytics.insights.map((insight, index) => (
            <div key={index} className="dashboard-card">
              <div className="dashboard-card-header">
                <h3 className="dashboard-card-title">{insight.title}</h3>
                <div className="dashboard-card-icon" style={{ 
                  backgroundColor: insight.type === 'positive' ? 'var(--accent-light)' : 
                                   insight.type === 'warning' ? '#fef3c7' : 'var(--bg-tertiary)',
                  color: insight.type === 'positive' ? 'var(--accent-primary)' : 
                         insight.type === 'warning' ? '#92400e' : 'var(--text-secondary)'
                }}>
                  {insight.icon}
                </div>
              </div>
              <p className="dashboard-card-content">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="card-title">Personalized Recommendations</h2>
          <p className="text-muted">Actionable steps to improve your health</p>
        </div>
        <div className="flex flex-col gap-3">
          {analytics.recommendations.map((rec, index) => (
            <div key={index} style={{ 
              padding: '1rem', 
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-secondary)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
                    {rec.title}
                  </h4>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {rec.category}
                  </p>
                </div>
                <span className={`badge ${rec.priority === 'high' ? 'error' : rec.priority === 'medium' ? 'warning' : 'success'}`}>
                  {rec.priority}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {rec.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Trend Chart Placeholder */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Health Trends</h2>
          <p className="text-muted">Your wellness metrics over the last 30 days</p>
        </div>
        <div style={{ 
          height: '200px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
            <div>Health trend visualization would go here</div>
            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
              (In a full implementation, this would show charts of your health metrics)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
