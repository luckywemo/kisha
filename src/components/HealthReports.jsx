import { useState, useEffect } from 'react'

export default function HealthReports() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState({});
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadReports();
  }, []);

  function loadReports() {
    const mockReports = [
      {
        id: 1,
        title: 'Weekly Wellness Summary',
        description: 'Comprehensive overview of your health metrics for the past week',
        type: 'weekly',
        icon: '📊',
        lastGenerated: '2024-01-15T10:30:00Z',
        frequency: 'weekly'
      },
      {
        id: 2,
        title: 'Monthly Health Trends',
        description: 'Analysis of health patterns and trends over the past month',
        type: 'monthly',
        icon: '📈',
        lastGenerated: '2024-01-01T09:00:00Z',
        frequency: 'monthly'
      },
      {
        id: 3,
        title: 'Assessment Progress Report',
        description: 'Track your improvement across different health assessments',
        type: 'assessment',
        icon: '📋',
        lastGenerated: '2024-01-14T15:45:00Z',
        frequency: 'on-demand'
      },
      {
        id: 4,
        title: 'Sleep Quality Analysis',
        description: 'Detailed analysis of your sleep patterns and quality',
        type: 'sleep',
        icon: '😴',
        lastGenerated: '2024-01-13T08:20:00Z',
        frequency: 'weekly'
      },
      {
        id: 5,
        title: 'Exercise Performance Report',
        description: 'Summary of your physical activity and fitness progress',
        type: 'exercise',
        icon: '🏃‍♂️',
        lastGenerated: '2024-01-12T18:30:00Z',
        frequency: 'weekly'
      },
      {
        id: 6,
        title: 'Mental Health Insights',
        description: 'Analysis of mood, stress levels, and mental wellness trends',
        type: 'mental-health',
        icon: '🧘‍♀️',
        lastGenerated: '2024-01-11T12:15:00Z',
        frequency: 'monthly'
      },
      {
        id: 7,
        title: 'Nutrition & Diet Report',
        description: 'Overview of your eating habits and nutritional patterns',
        type: 'nutrition',
        icon: '🥗',
        lastGenerated: '2024-01-10T14:00:00Z',
        frequency: 'weekly'
      },
      {
        id: 8,
        title: 'Comprehensive Health Profile',
        description: 'Complete health assessment and recommendations report',
        type: 'comprehensive',
        icon: '🏥',
        lastGenerated: '2024-01-05T11:30:00Z',
        frequency: 'monthly'
      }
    ];
    setReports(mockReports);
  }

  async function generateReport(reportId) {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockData = generateMockReportData(reportId);
      setReportData(mockData);
      setSelectedReport(reports.find(r => r.id === reportId));
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function generateMockReportData(reportId) {
    const baseData = {
      generatedAt: new Date().toISOString(),
      dateRange: dateRange,
      summary: {
        overallScore: 78,
        trend: 'improving',
        keyInsights: [
          'Sleep quality has improved by 15% this week',
          'Exercise consistency is above average',
          'Stress levels are decreasing',
          'Hydration habits need improvement'
        ]
      }
    };

    switch (reportId) {
      case 1: // Weekly Wellness Summary
        return {
          ...baseData,
          metrics: {
            sleep: { average: 7.2, trend: '+0.3h', score: 8 },
            exercise: { total: 180, trend: '+15min', score: 7 },
            mood: { average: 7.5, trend: '+0.8', score: 8 },
            stress: { average: 4.2, trend: '-0.5', score: 6 },
            hydration: { average: 6.8, trend: '-0.2', score: 5 }
          },
          recommendations: [
            'Increase water intake to 8 glasses daily',
            'Maintain current exercise routine',
            'Continue improving sleep hygiene',
            'Practice stress management techniques'
          ]
        };

      case 2: // Monthly Health Trends
        return {
          ...baseData,
          trends: {
            sleep: { data: [6.5, 6.8, 7.0, 7.2, 7.1, 7.3, 7.2], trend: 'improving' },
            exercise: { data: [120, 135, 150, 165, 180, 175, 180], trend: 'increasing' },
            mood: { data: [6.2, 6.5, 6.8, 7.0, 7.2, 7.4, 7.5], trend: 'improving' },
            stress: { data: [6.5, 6.2, 5.8, 5.5, 5.0, 4.5, 4.2], trend: 'decreasing' }
          },
          insights: [
            'Consistent improvement in sleep quality over the month',
            'Exercise frequency has increased steadily',
            'Mood scores show positive correlation with exercise',
            'Stress management techniques are working effectively'
          ]
        };

      case 3: // Assessment Progress Report
        return {
          ...baseData,
          assessments: [
            { name: 'General Wellness', score: 85, previous: 78, change: '+7' },
            { name: 'Sleep Quality', score: 72, previous: 65, change: '+7' },
            { name: 'Stress Level', score: 68, previous: 55, change: '+13' },
            { name: 'Physical Activity', score: 82, previous: 75, change: '+7' },
            { name: 'Nutrition', score: 71, previous: 68, change: '+3' }
          ],
          improvements: [
            'Stress management skills have improved significantly',
            'Sleep quality shows consistent improvement',
            'Physical activity levels are above target',
            'Nutrition awareness is increasing'
          ]
        };

      case 4: // Sleep Quality Analysis
        return {
          ...baseData,
          sleepMetrics: {
            averageDuration: 7.2,
            averageQuality: 7.8,
            consistency: 85,
            bedtime: '10:30 PM',
            wakeTime: '6:30 AM',
            sleepEfficiency: 92
          },
          patterns: {
            bestDays: ['Monday', 'Tuesday', 'Wednesday'],
            worstDays: ['Friday', 'Saturday'],
            commonDisruptions: ['Work stress', 'Late dinner', 'Screen time']
          },
          recommendations: [
            'Maintain consistent bedtime routine',
            'Avoid screens 1 hour before bed',
            'Keep bedroom cool and dark',
            'Limit caffeine after 2 PM'
          ]
        };

      case 5: // Exercise Performance Report
        return {
          ...baseData,
          exerciseMetrics: {
            totalMinutes: 180,
            averagePerDay: 25.7,
            activeDays: 7,
            caloriesBurned: 2100,
            favoriteActivity: 'Running'
          },
          activities: [
            { name: 'Running', minutes: 90, calories: 900 },
            { name: 'Strength Training', minutes: 60, calories: 600 },
            { name: 'Yoga', minutes: 30, calories: 150 }
          ],
          goals: {
            weeklyTarget: 150,
            currentProgress: 120,
            completionRate: 80
          }
        };

      case 6: // Mental Health Insights
        return {
          ...baseData,
          mentalHealthMetrics: {
            averageMood: 7.5,
            stressLevel: 4.2,
            anxietyLevel: 3.8,
            energyLevel: 7.2,
            socialConnection: 8.1
          },
          patterns: {
            moodTriggers: ['Work deadlines', 'Social events', 'Exercise'],
            copingStrategies: ['Meditation', 'Exercise', 'Talking to friends'],
            bestTimes: ['Morning', 'After exercise'],
            challengingTimes: ['Evening', 'Before bed']
          },
          recommendations: [
            'Continue meditation practice',
            'Maintain social connections',
            'Practice gratitude journaling',
            'Consider professional support if needed'
          ]
        };

      case 7: // Nutrition & Diet Report
        return {
          ...baseData,
          nutritionMetrics: {
            averageMeals: 2.8,
            waterIntake: 6.8,
            fruitServings: 2.1,
            vegetableServings: 3.2,
            processedFoods: 1.5
          },
          patterns: {
            bestMeals: ['Breakfast', 'Lunch'],
            challengingMeals: ['Dinner', 'Snacks'],
            commonFoods: ['Oatmeal', 'Salad', 'Chicken', 'Rice'],
            hydration: 'Below recommended 8 glasses'
          },
          recommendations: [
            'Increase water intake to 8 glasses daily',
            'Add more vegetables to dinner',
            'Reduce processed food consumption',
            'Plan healthy snacks'
          ]
        };

      case 8: // Comprehensive Health Profile
        return {
          ...baseData,
          overallHealth: {
            score: 78,
            category: 'Good',
            riskFactors: ['Sedentary lifestyle', 'Stress'],
            strengths: ['Sleep quality', 'Exercise consistency', 'Social connections']
          },
          bodyMetrics: {
            weight: '70kg',
            bmi: 22.5,
            bodyFat: 18,
            muscleMass: 35
          },
          lifestyle: {
            sleep: 'Good',
            exercise: 'Excellent',
            nutrition: 'Fair',
            stress: 'Moderate',
            social: 'Excellent'
          },
          recommendations: [
            'Focus on nutrition improvements',
            'Continue current exercise routine',
            'Implement stress management techniques',
            'Maintain social connections'
          ],
          nextSteps: [
            'Set specific nutrition goals',
            'Schedule regular health checkups',
            'Consider working with a nutritionist',
            'Track progress monthly'
          ]
        };

      default:
        return baseData;
    }
  }

  function getTrendIcon(trend) {
    const icons = {
      'improving': '📈',
      'declining': '📉',
      'stable': '➡️',
      'increasing': '📈',
      'decreasing': '📉'
    };
    return icons[trend] || '➡️';
  }

  function getTrendColor(trend) {
    const colors = {
      'improving': 'var(--success)',
      'declining': 'var(--error)',
      'stable': 'var(--text-muted)',
      'increasing': 'var(--success)',
      'decreasing': 'var(--error)'
    };
    return colors[trend] || 'var(--text-muted)';
  }

  function getScoreColor(score) {
    if (score >= 8) return 'var(--success)';
    if (score >= 6) return 'var(--warning)';
    return 'var(--error)';
  }

  return (
    <div>
      {/* Header */}
      <div className="card mb-6">
        <div className="card-header">
          <h1 className="card-title">Health Reports</h1>
          <p className="text-muted">Generate comprehensive health reports and insights</p>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="card-title">Report Period</h3>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label>Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            />
          </div>
          <div>
            <label>End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="dashboard-grid mb-6">
        {reports.map((report) => (
          <div key={report.id} className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">{report.title}</h3>
              <div className="dashboard-card-icon primary">{report.icon}</div>
            </div>
            
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {report.description}
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {report.frequency}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Last: {new Date(report.lastGenerated).toLocaleDateString()}
                </span>
              </div>
            </div>

            <button 
              className="primary"
              style={{ width: '100%', fontSize: '0.875rem' }}
              onClick={() => generateReport(report.id)}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        ))}
      </div>

      {/* Report Display */}
      {selectedReport && reportData && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">{selectedReport.title}</h2>
            <p className="text-muted">
              Generated on {new Date(reportData.generatedAt).toLocaleString()}
            </p>
          </div>

          <div style={{ padding: '1.5rem' }}>
            {/* Summary */}
            {reportData.summary && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Summary</h3>
                <div style={{ 
                  padding: '1rem', 
                  backgroundColor: 'var(--bg-secondary)', 
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: getScoreColor(reportData.summary.overallScore) }}>
                      {reportData.summary.overallScore}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>Overall Health Score</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: getTrendColor(reportData.summary.trend) }}>
                        {getTrendIcon(reportData.summary.trend)} {reportData.summary.trend}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: 600 }}>Key Insights:</h4>
                    <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                      {reportData.summary.keyInsights.map((insight, index) => (
                        <li key={index} style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Metrics */}
            {reportData.metrics && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Health Metrics</h3>
                <div className="dashboard-grid">
                  {Object.entries(reportData.metrics).map(([key, value]) => (
                    <div key={key} className="dashboard-card">
                      <div className="dashboard-card-header">
                        <h4 className="dashboard-card-title" style={{ textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <div className="dashboard-card-icon" style={{ color: getScoreColor(value.score) }}>
                          {getTrendIcon(value.trend)}
                        </div>
                      </div>
                      <div className="dashboard-card-value">{value.average}</div>
                      <p className="dashboard-card-content" style={{ color: getTrendColor(value.trend) }}>
                        {value.trend} ({value.trend})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {reportData.recommendations && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Recommendations</h3>
                <div className="flex flex-col gap-3">
                  {reportData.recommendations.map((rec, index) => (
                    <div key={index} className="card" style={{ padding: '1rem', borderLeft: '4px solid var(--accent-primary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>💡</span>
                        <span style={{ fontSize: '0.875rem' }}>{rec}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Export Options */}
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'var(--bg-secondary)', 
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', fontWeight: 600 }}>Export Report</h4>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Download this report in PDF, CSV, or JSON format
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="secondary" style={{ fontSize: '0.75rem' }}>PDF</button>
                <button className="secondary" style={{ fontSize: '0.75rem' }}>CSV</button>
                <button className="secondary" style={{ fontSize: '0.75rem' }}>JSON</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
