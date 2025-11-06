import { useState, useEffect } from 'react'
import { api } from '../api'

export default function ReminderSystem() {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    type: 'medication',
    time: '',
    frequency: 'daily',
    isActive: true
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadReminders();
    requestNotificationPermission();
  }, []);

  async function loadReminders() {
    try {
      const res = await api.listReminders();
      setReminders(res);
    } catch (_) {
      setReminders([]);
    }
  }

  async function requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted');
      }
    }
  }

  async function addReminder() {
    if (!newReminder.title || !newReminder.time) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const created = await api.createReminder(newReminder);
      setReminders([created, ...reminders]);
      setNewReminder({
        title: '',
        description: '',
        type: 'medication',
        time: '',
        frequency: 'daily',
        isActive: true
      });
      setShowAddForm(false);
    } catch (e) {
      alert(e.message || 'Failed to create reminder');
    }
  }

  function calculateNextTrigger(time, frequency) {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const nextTrigger = new Date();
    nextTrigger.setHours(hours, minutes, 0, 0);

    if (frequency === 'daily') {
      if (nextTrigger <= now) {
        nextTrigger.setDate(nextTrigger.getDate() + 1);
      }
    } else if (frequency === 'weekly') {
      nextTrigger.setDate(nextTrigger.getDate() + 7);
    } else if (frequency === 'monthly') {
      nextTrigger.setMonth(nextTrigger.getMonth() + 1);
    }

    return nextTrigger.toISOString();
  }

  async function toggleReminder(id) {
    try {
      const toggled = await api.toggleReminder({ id });
      setReminders(reminders.map(r => r.id === id ? toggled : r));
    } catch (e) {
      alert(e.message || 'Failed to toggle reminder');
    }
  }

  async function deleteReminder(id) {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      try {
        await api.deleteReminder({ id });
        setReminders(reminders.filter(reminder => reminder.id !== id));
      } catch (e) {
        alert(e.message || 'Failed to delete reminder');
      }
    }
  }

  async function markAsCompleted(id) {
    const now = new Date().toISOString();
    try {
      const updated = await api.completeReminder({ id, notes: '' });
      setReminders(reminders.map(r => r.id === id ? updated : r));
    } catch (e) {
      // fallback locally if API fails
      setReminders(reminders.map(reminder => 
        reminder.id === id 
          ? { 
              ...reminder, 
              lastTriggered: now,
              nextTrigger: calculateNextTrigger(reminder.time, reminder.frequency)
            }
          : reminder
      ));
    }

    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      const reminder = reminders.find(r => r.id === id);
      new Notification('Reminder Completed', {
        body: `${reminder.title} has been marked as completed`,
        icon: '/favicon.ico'
      });
    }
  }

  function getTypeIcon(type) {
    const icons = {
      'medication': '💊',
      'hydration': '💧',
      'exercise': '🏃‍♂️',
      'assessment': '📋',
      'mental-health': '🧘‍♀️',
      'sleep': '😴',
      'nutrition': '🥗',
      'general': '⏰'
    };
    return icons[type] || '⏰';
  }

  function getTypeColor(type) {
    const colors = {
      'medication': 'var(--error)',
      'hydration': 'var(--accent-primary)',
      'exercise': 'var(--success)',
      'assessment': 'var(--warning)',
      'mental-health': 'var(--accent-primary)',
      'sleep': 'var(--text-muted)',
      'nutrition': 'var(--success)',
      'general': 'var(--text-secondary)'
    };
    return colors[type] || 'var(--text-secondary)';
  }

  function getFrequencyText(frequency) {
    const texts = {
      'daily': 'Every day',
      'weekly': 'Weekly',
      'monthly': 'Monthly',
      'custom': 'Custom'
    };
    return texts[frequency] || frequency;
  }

  function getTimeUntilNext(nextTrigger) {
    if (!nextTrigger) return 'Inactive';
    
    const now = new Date();
    const next = new Date(nextTrigger);
    const diff = next - now;
    
    if (diff <= 0) return 'Overdue';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  const activeReminders = reminders.filter(r => r.isActive);
  const overdueReminders = activeReminders.filter(r => {
    if (!r.nextTrigger) return false;
    return new Date(r.nextTrigger) <= new Date();
  });

  return (
    <div>
      {/* Overview Stats */}
      <div className="dashboard-grid mb-6">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Active Reminders</h3>
            <div className="dashboard-card-icon primary">⏰</div>
          </div>
          <div className="dashboard-card-value">{activeReminders.length}</div>
          <p className="dashboard-card-content">Currently active</p>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Overdue</h3>
            <div className="dashboard-card-icon error">⚠️</div>
          </div>
          <div className="dashboard-card-value">{overdueReminders.length}</div>
          <p className="dashboard-card-content">Need attention</p>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Completed Today</h3>
            <div className="dashboard-card-icon success">✅</div>
          </div>
          <div className="dashboard-card-value">
            {reminders.filter(r => {
              if (!r.lastTriggered) return false;
              const lastTriggered = new Date(r.lastTriggered);
              const today = new Date();
              return lastTriggered.toDateString() === today.toDateString();
            }).length}
          </div>
          <p className="dashboard-card-content">Reminders completed</p>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Success Rate</h3>
            <div className="dashboard-card-icon warning">📈</div>
          </div>
          <div className="dashboard-card-value">87%</div>
          <p className="dashboard-card-content">Completion rate</p>
        </div>
      </div>

      {/* Add Reminder Form */}
      <div className="card mb-6">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className="card-title">Reminders & Notifications</h2>
              <p className="text-muted">Set up reminders for medications, exercises, and health activities</p>
            </div>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="primary"
            >
              {showAddForm ? 'Cancel' : '+ Add Reminder'}
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
                <label>Reminder Title</label>
                <input
                  type="text"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                  placeholder="e.g., Take Vitamin D"
                />
              </div>
              <div>
                <label>Type</label>
                <select
                  value={newReminder.type}
                  onChange={(e) => setNewReminder({...newReminder, type: e.target.value})}
                >
                  <option value="medication">💊 Medication</option>
                  <option value="hydration">💧 Hydration</option>
                  <option value="exercise">🏃‍♂️ Exercise</option>
                  <option value="assessment">📋 Assessment</option>
                  <option value="mental-health">🧘‍♀️ Mental Health</option>
                  <option value="sleep">😴 Sleep</option>
                  <option value="nutrition">🥗 Nutrition</option>
                  <option value="general">⏰ General</option>
                </select>
              </div>
              <div>
                <label>Time</label>
                <input
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                />
              </div>
              <div>
                <label>Frequency</label>
                <select
                  value={newReminder.frequency}
                  onChange={(e) => setNewReminder({...newReminder, frequency: e.target.value})}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Description (Optional)</label>
              <textarea
                value={newReminder.description}
                onChange={(e) => setNewReminder({...newReminder, description: e.target.value})}
                placeholder="Additional details about this reminder..."
                rows={2}
              />
            </div>
            <button onClick={addReminder} className="primary">
              Add Reminder
            </button>
          </div>
        )}
      </div>

      {/* Reminders List */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">My Reminders</h3>
        </div>
        <div className="flex flex-col gap-4">
          {reminders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">⏰</div>
              <div className="empty-state-title">No reminders set</div>
              <div className="empty-state-description">Add your first reminder to get started</div>
            </div>
          ) : (
            reminders.map((reminder) => (
              <div key={reminder.id} className="card" style={{ 
                padding: '1rem',
                borderLeft: `4px solid ${getTypeColor(reminder.type)}`,
                opacity: reminder.isActive ? 1 : 0.6
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '1.5rem' }}>{getTypeIcon(reminder.type)}</div>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 600 }}>
                        {reminder.title}
                      </h4>
                      {reminder.description && (
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {reminder.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => toggleReminder(reminder.id)}
                      className="secondary"
                      style={{ fontSize: '0.75rem', padding: '0.5rem' }}
                    >
                      {reminder.isActive ? 'Disable' : 'Enable'}
                    </button>
                    <button 
                      onClick={() => deleteReminder(reminder.id)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--error)', 
                        cursor: 'pointer',
                        padding: '0.5rem'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Time</div>
                    <div style={{ fontWeight: 600 }}>{reminder.time}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Frequency</div>
                    <div style={{ fontWeight: 600 }}>{getFrequencyText(reminder.frequency)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Next Trigger</div>
                    <div style={{ 
                      fontWeight: 600, 
                      color: getTimeUntilNext(reminder.nextTrigger) === 'Overdue' ? 'var(--error)' : 'var(--text-primary)'
                    }}>
                      {getTimeUntilNext(reminder.nextTrigger)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Status</div>
                    <div style={{ 
                      fontWeight: 600, 
                      color: reminder.isActive ? 'var(--success)' : 'var(--text-muted)'
                    }}>
                      {reminder.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>

                {reminder.isActive && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Last completed: {reminder.lastTriggered ? new Date(reminder.lastTriggered).toLocaleString() : 'Never'}
                    </span>
                    <button 
                      onClick={() => markAsCompleted(reminder.id)}
                      className="primary"
                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                    >
                      Mark as Completed
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

