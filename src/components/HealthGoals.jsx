import { useState, useEffect } from 'react'
import { api } from '../api'

export default function HealthGoals() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'general',
    target: '',
    deadline: '',
    priority: 'medium'
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGoals();
  }, []);

  async function loadGoals() {
    try {
      setLoading(true);
      const response = await api.listGoals();
      setGoals(response.goals || []);
    } catch (err) {
      console.error('Error loading goals:', err);
      setError('Failed to load goals');
      // Fallback to mock data for development
      const mockGoals = [
        {
          id: 1,
          title: 'Walk 10,000 steps daily',
          description: 'Increase daily physical activity by walking more',
          category: 'exercise',
          target: '10,000 steps',
          deadline: '2024-02-15',
          priority: 'high',
          progress: 75,
          status: 'active',
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          title: 'Drink 8 glasses of water',
          description: 'Stay properly hydrated throughout the day',
          category: 'nutrition',
          target: '8 glasses',
          deadline: '2024-02-20',
          priority: 'medium',
          progress: 60,
          status: 'active',
          createdAt: '2024-01-20'
        },
        {
          id: 3,
          title: 'Sleep 8 hours nightly',
          description: 'Improve sleep quality and duration',
          category: 'sleep',
          target: '8 hours',
          deadline: '2024-02-10',
          priority: 'high',
          progress: 90,
          status: 'active',
          createdAt: '2024-01-10'
        },
        {
          id: 4,
          title: 'Meditate 10 minutes daily',
          description: 'Practice mindfulness and stress reduction',
          category: 'mental-health',
          target: '10 minutes',
          deadline: '2024-01-30',
          priority: 'low',
          progress: 100,
          status: 'completed',
          createdAt: '2024-01-01'
        }
      ];
      setGoals(mockGoals);
    } finally {
      setLoading(false);
    }
  }

  async function addGoal() {
    if (!newGoal.title.trim() || !newGoal.target.trim()) return;

    try {
      setLoading(true);
      const response = await api.createGoal(newGoal);
      setGoals([response.goal, ...goals]);
      setNewGoal({
        title: '',
        description: '',
        category: 'general',
        target: '',
        deadline: '',
        priority: 'medium'
      });
      setShowAddForm(false);
    } catch (err) {
      console.error('Error creating goal:', err);
      setError('Failed to create goal');
    } finally {
      setLoading(false);
    }
  }

  async function updateProgress(goalId, newProgress) {
    try {
      const progress = Math.min(100, Math.max(0, newProgress));
      const response = await api.updateGoal({ id: goalId, updates: { progress } });
      
      setGoals(goals.map(goal => 
        goal.id === goalId ? response.goal : goal
      ));
    } catch (err) {
      console.error('Error updating goal:', err);
      setError('Failed to update goal progress');
    }
  }

  async function deleteGoal(goalId) {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    
    try {
      await api.deleteGoal({ id: goalId });
      setGoals(goals.filter(goal => goal.id !== goalId));
    } catch (err) {
      console.error('Error deleting goal:', err);
      setError('Failed to delete goal');
    }
  }

  function getCategoryIcon(category) {
    const icons = {
      'exercise': '🏃‍♂️',
      'nutrition': '🥗',
      'sleep': '😴',
      'mental-health': '🧘‍♀️',
      'general': '🎯'
    };
    return icons[category] || '🎯';
  }

  function getPriorityColor(priority) {
    const colors = {
      'high': 'var(--error)',
      'medium': 'var(--warning)',
      'low': 'var(--success)'
    };
    return colors[priority] || 'var(--text-muted)';
  }

  function getProgressColor(progress) {
    if (progress >= 80) return 'var(--success)';
    if (progress >= 50) return 'var(--warning)';
    return 'var(--error)';
  }

  function getDaysUntilDeadline(deadline) {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  return (
    <div>
      {error && (
        <div className="card mb-6" style={{ backgroundColor: 'var(--error)', color: 'white' }}>
          <div className="card-header">
            <h3 className="card-title">Error</h3>
          </div>
          <p>{error}</p>
          <button onClick={() => setError('')} className="secondary">
            Dismiss
          </button>
        </div>
      )}

      {loading && (
        <div className="card mb-6">
          <div className="flex items-center justify-center" style={{ minHeight: '100px' }}>
            <div className="loading"></div>
            <span style={{ marginLeft: '1rem' }}>Loading goals...</span>
          </div>
        </div>
      )}

      {/* Goals Overview */}
      <div className="dashboard-grid mb-6">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Active Goals</h3>
            <div className="dashboard-card-icon primary">🎯</div>
          </div>
          <div className="dashboard-card-value">{activeGoals.length}</div>
          <p className="dashboard-card-content">Goals in progress</p>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Completed</h3>
            <div className="dashboard-card-icon success">✅</div>
          </div>
          <div className="dashboard-card-value">{completedGoals.length}</div>
          <p className="dashboard-card-content">Goals achieved</p>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Success Rate</h3>
            <div className="dashboard-card-icon warning">📊</div>
          </div>
          <div className="dashboard-card-value">
            {goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0}%
          </div>
          <p className="dashboard-card-content">Overall completion rate</p>
        </div>
      </div>

      {/* Add Goal Form */}
      <div className="card mb-6">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className="card-title">Health Goals</h2>
              <p className="text-muted">Set and track your wellness objectives</p>
            </div>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="primary"
            >
              {showAddForm ? 'Cancel' : '+ Add Goal'}
            </button>
          </div>
        </div>

        {showAddForm && (
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: 'var(--bg-secondary)', 
            borderRadius: 'var(--radius-md)',
            marginTop: '1rem'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label>Goal Title</label>
                <input
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  placeholder="e.g., Walk 10,000 steps daily"
                />
              </div>
              <div>
                <label>Target</label>
                <input
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                  placeholder="e.g., 10,000 steps"
                />
              </div>
              <div>
                <label>Category</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                >
                  <option value="general">General</option>
                  <option value="exercise">Exercise</option>
                  <option value="nutrition">Nutrition</option>
                  <option value="sleep">Sleep</option>
                  <option value="mental-health">Mental Health</option>
                </select>
              </div>
              <div>
                <label>Priority</label>
                <select
                  value={newGoal.priority}
                  onChange={(e) => setNewGoal({...newGoal, priority: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label>Deadline</label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Description</label>
              <textarea
                value={newGoal.description}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                placeholder="Describe your goal and why it's important..."
                rows={3}
              />
            </div>
            <button onClick={addGoal} className="primary">
              Create Goal
            </button>
          </div>
        )}
      </div>

      {/* Goals List */}
      <div className="flex flex-col gap-4">
        {goals.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">🎯</div>
              <div className="empty-state-title">No goals set yet</div>
              <div className="empty-state-description">Create your first health goal to get started</div>
            </div>
          </div>
        ) : (
          goals.map((goal) => (
            <div key={goal.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '2rem' }}>{getCategoryIcon(goal.category)}</div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>
                      {goal.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
                      <span className={`badge ${goal.priority === 'high' ? 'error' : goal.priority === 'medium' ? 'warning' : 'success'}`}>
                        {goal.priority}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Target: {goal.target}
                      </span>
                      {goal.deadline && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Due: {goal.deadline} ({getDaysUntilDeadline(goal.deadline)} days)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: goal.status === 'completed' ? 'var(--success)' : 'var(--text-muted)' 
                  }}>
                    {goal.status === 'completed' ? '✅ Completed' : '🔄 Active'}
                  </span>
                  <button 
                    onClick={() => deleteGoal(goal.id)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--error)', 
                      cursor: 'pointer',
                      padding: '0.25rem'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {goal.description && (
                <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {goal.description}
                </p>
              )}

              {/* Progress Section */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Progress</span>
                  <span style={{ fontSize: '0.875rem', color: getProgressColor(goal.progress), fontWeight: 600 }}>
                    {goal.progress}%
                  </span>
                </div>
                <div style={{ 
                  height: '8px', 
                  backgroundColor: 'var(--bg-tertiary)', 
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '0.75rem'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${goal.progress}%`,
                    backgroundColor: getProgressColor(goal.progress),
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                
                {goal.status === 'active' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => updateProgress(goal.id, goal.progress - 10)}
                      disabled={goal.progress <= 0}
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                    >
                      -10%
                    </button>
                    <button 
                      onClick={() => updateProgress(goal.id, goal.progress + 10)}
                      disabled={goal.progress >= 100}
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                    >
                      +10%
                    </button>
                    <button 
                      onClick={() => updateProgress(goal.id, 100)}
                      disabled={goal.progress >= 100}
                      className="primary"
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                    >
                      Mark Complete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
