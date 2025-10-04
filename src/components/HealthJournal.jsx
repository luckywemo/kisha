import { useState, useEffect } from 'react'
import { api } from '../api'

export default function HealthJournal() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    mood: 5,
    energy: 5,
    sleep: 8,
    exercise: 0,
    water: 8,
    stress: 3,
    notes: '',
    symptoms: [],
    activities: [],
    meals: []
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('calendar'); // calendar, list, chart
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadJournalEntries();
  }, []);

  async function loadJournalEntries() {
    try {
      setLoading(true);
      const response = await api.listJournalEntries();
      setEntries(response.entries || []);
    } catch (err) {
      console.error('Error loading journal entries:', err);
      setError('Failed to load journal entries');
      // Fallback to mock data for development
      const mockEntries = [
        {
          id: 1,
          date: '2024-01-15',
          mood: 7,
          energy: 6,
          sleep: 7.5,
          exercise: 45,
          water: 8,
          stress: 4,
          notes: 'Had a great workout this morning. Feeling energized and positive.',
          symptoms: ['Headache (mild)', 'Stiff neck'],
          activities: ['Morning run', 'Meditation', 'Work'],
          meals: ['Oatmeal with berries', 'Grilled chicken salad', 'Salmon with vegetables']
        },
        {
          id: 2,
          date: '2024-01-14',
          mood: 5,
          energy: 4,
          sleep: 6,
          exercise: 0,
          water: 6,
          stress: 7,
          notes: 'Tough day at work. Didn\'t get enough sleep last night.',
          symptoms: ['Fatigue', 'Anxiety'],
          activities: ['Work', 'Netflix'],
          meals: ['Coffee and toast', 'Fast food lunch', 'Pizza for dinner']
        },
        {
          id: 3,
          date: '2024-01-13',
          mood: 8,
          energy: 8,
          sleep: 8.5,
          exercise: 60,
          water: 10,
          stress: 2,
          notes: 'Perfect day! Great sleep, good workout, and productive work day.',
          symptoms: [],
          activities: ['Gym workout', 'Hiking', 'Cooking'],
          meals: ['Protein smoothie', 'Quinoa bowl', 'Grilled fish with vegetables']
        }
      ];
      setEntries(mockEntries);
    } finally {
      setLoading(false);
    }
  }

  async function addEntry() {
    if (!newEntry.date) return;

    try {
      setLoading(true);
      const response = await api.createJournalEntry(newEntry);
      setEntries([response.entry, ...entries]);
      setNewEntry({
        date: new Date().toISOString().split('T')[0],
        mood: 5,
        energy: 5,
        sleep: 8,
        exercise: 0,
        water: 8,
        stress: 3,
        notes: '',
        symptoms: [],
        activities: [],
        meals: []
      });
      setShowAddForm(false);
    } catch (err) {
      console.error('Error creating journal entry:', err);
      setError('Failed to create journal entry');
    } finally {
      setLoading(false);
    }
  }

  async function updateEntry(id, updates) {
    try {
      const response = await api.updateJournalEntry({ id, updates });
      setEntries(entries.map(entry => 
        entry.id === id ? response.entry : entry
      ));
    } catch (err) {
      console.error('Error updating journal entry:', err);
      setError('Failed to update journal entry');
    }
  }

  async function deleteEntry(id) {
    if (!window.confirm('Are you sure you want to delete this journal entry?')) return;
    
    try {
      await api.deleteJournalEntry({ id });
      setEntries(entries.filter(entry => entry.id !== id));
    } catch (err) {
      console.error('Error deleting journal entry:', err);
      setError('Failed to delete journal entry');
    }
  }

  function getMoodEmoji(mood) {
    if (mood >= 8) return '😄';
    if (mood >= 6) return '😊';
    if (mood >= 4) return '😐';
    if (mood >= 2) return '😔';
    return '😢';
  }

  function getMoodColor(mood) {
    if (mood >= 8) return 'var(--success)';
    if (mood >= 6) return '#10b981';
    if (mood >= 4) return 'var(--warning)';
    if (mood >= 2) return '#f59e0b';
    return 'var(--error)';
  }

  function getEnergyColor(energy) {
    if (energy >= 8) return 'var(--success)';
    if (energy >= 6) return '#10b981';
    if (energy >= 4) return 'var(--warning)';
    return 'var(--error)';
  }

  function getStressColor(stress) {
    if (stress <= 3) return 'var(--success)';
    if (stress <= 5) return 'var(--warning)';
    return 'var(--error)';
  }

  function getWeeklyStats() {
    const last7Days = entries.slice(0, 7);
    if (last7Days.length === 0) return null;

    const avgMood = last7Days.reduce((sum, entry) => sum + entry.mood, 0) / last7Days.length;
    const avgEnergy = last7Days.reduce((sum, entry) => sum + entry.energy, 0) / last7Days.length;
    const avgSleep = last7Days.reduce((sum, entry) => sum + entry.sleep, 0) / last7Days.length;
    const avgStress = last7Days.reduce((sum, entry) => sum + entry.stress, 0) / last7Days.length;
    const totalExercise = last7Days.reduce((sum, entry) => sum + entry.exercise, 0);
    const avgWater = last7Days.reduce((sum, entry) => sum + entry.water, 0) / last7Days.length;

    return {
      avgMood: avgMood.toFixed(1),
      avgEnergy: avgEnergy.toFixed(1),
      avgSleep: avgSleep.toFixed(1),
      avgStress: avgStress.toFixed(1),
      totalExercise,
      avgWater: avgWater.toFixed(1)
    };
  }

  const selectedEntry = entries.find(entry => entry.date === selectedDate);
  const weeklyStats = getWeeklyStats();

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
            <span style={{ marginLeft: '1rem' }}>Loading journal entries...</span>
          </div>
        </div>
      )}

      {/* Overview Stats */}
      {weeklyStats && (
        <div className="dashboard-grid mb-6">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Avg Mood</h3>
              <div className="dashboard-card-icon" style={{ color: getMoodColor(weeklyStats.avgMood) }}>
                {getMoodEmoji(weeklyStats.avgMood)}
              </div>
            </div>
            <div className="dashboard-card-value">{weeklyStats.avgMood}</div>
            <p className="dashboard-card-content">Last 7 days</p>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Avg Energy</h3>
              <div className="dashboard-card-icon" style={{ color: getEnergyColor(weeklyStats.avgEnergy) }}>
                ⚡
              </div>
            </div>
            <div className="dashboard-card-value">{weeklyStats.avgEnergy}</div>
            <p className="dashboard-card-content">Out of 10</p>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Avg Sleep</h3>
              <div className="dashboard-card-icon primary">😴</div>
            </div>
            <div className="dashboard-card-value">{weeklyStats.avgSleep}h</div>
            <p className="dashboard-card-content">Per night</p>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Exercise</h3>
              <div className="dashboard-card-icon success">🏃‍♂️</div>
            </div>
            <div className="dashboard-card-value">{weeklyStats.totalExercise}m</div>
            <p className="dashboard-card-content">This week</p>
          </div>
        </div>
      )}

      {/* Add Entry Form */}
      <div className="card mb-6">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className="card-title">Health Journal</h2>
              <p className="text-muted">Track your daily health and wellness</p>
            </div>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="primary"
            >
              {showAddForm ? 'Cancel' : '+ Add Entry'}
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
                <label>Date</label>
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                />
              </div>
              <div>
                <label>Mood (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newEntry.mood}
                  onChange={(e) => setNewEntry({...newEntry, mood: parseInt(e.target.value)})}
                />
                <div style={{ textAlign: 'center', marginTop: '0.25rem', fontWeight: 600, color: getMoodColor(newEntry.mood) }}>
                  {newEntry.mood} {getMoodEmoji(newEntry.mood)}
                </div>
              </div>
              <div>
                <label>Energy Level (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newEntry.energy}
                  onChange={(e) => setNewEntry({...newEntry, energy: parseInt(e.target.value)})}
                />
                <div style={{ textAlign: 'center', marginTop: '0.25rem', fontWeight: 600, color: getEnergyColor(newEntry.energy) }}>
                  {newEntry.energy}/10
                </div>
              </div>
              <div>
                <label>Sleep Hours</label>
                <input
                  type="number"
                  min="0"
                  max="12"
                  step="0.5"
                  value={newEntry.sleep}
                  onChange={(e) => setNewEntry({...newEntry, sleep: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <label>Exercise (minutes)</label>
                <input
                  type="number"
                  min="0"
                  max="300"
                  value={newEntry.exercise}
                  onChange={(e) => setNewEntry({...newEntry, exercise: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label>Water Glasses</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={newEntry.water}
                  onChange={(e) => setNewEntry({...newEntry, water: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label>Stress Level (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newEntry.stress}
                  onChange={(e) => setNewEntry({...newEntry, stress: parseInt(e.target.value)})}
                />
                <div style={{ textAlign: 'center', marginTop: '0.25rem', fontWeight: 600, color: getStressColor(newEntry.stress) }}>
                  {newEntry.stress}/10
                </div>
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Daily Notes</label>
              <textarea
                value={newEntry.notes}
                onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                placeholder="How was your day? Any observations or thoughts..."
                rows={3}
              />
            </div>
            <button onClick={addEntry} className="primary">
              Add Journal Entry
            </button>
          </div>
        )}
      </div>

      {/* View Mode Toggle */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="card-title">Journal Entries</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setViewMode('calendar')}
              className={viewMode === 'calendar' ? 'primary' : 'secondary'}
              style={{ fontSize: '0.875rem' }}
            >
              📅 Calendar
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'primary' : 'secondary'}
              style={{ fontSize: '0.875rem' }}
            >
              📋 List
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={viewMode === 'chart' ? 'primary' : 'secondary'}
              style={{ fontSize: '0.875rem' }}
            >
              📊 Charts
            </button>
          </div>
        </div>

        {viewMode === 'calendar' && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Select Date to View Entry</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ marginTop: '0.5rem' }}
              />
            </div>
            {selectedEntry ? (
              <div className="card" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{getMoodEmoji(selectedEntry.mood)}</div>
                    <div style={{ fontWeight: 600 }}>Mood: {selectedEntry.mood}/10</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
                    <div style={{ fontWeight: 600 }}>Energy: {selectedEntry.energy}/10</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>😴</div>
                    <div style={{ fontWeight: 600 }}>Sleep: {selectedEntry.sleep}h</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏃‍♂️</div>
                    <div style={{ fontWeight: 600 }}>Exercise: {selectedEntry.exercise}m</div>
                  </div>
                </div>
                {selectedEntry.notes && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Notes:</strong> {selectedEntry.notes}
                  </div>
                )}
                {selectedEntry.symptoms.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Symptoms:</strong> {selectedEntry.symptoms.join(', ')}
                  </div>
                )}
                {selectedEntry.activities.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Activities:</strong> {selectedEntry.activities.join(', ')}
                  </div>
                )}
                {selectedEntry.meals.length > 0 && (
                  <div>
                    <strong>Meals:</strong> {selectedEntry.meals.join(', ')}
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📅</div>
                <div className="empty-state-title">No entry for this date</div>
                <div className="empty-state-description">Add a journal entry to track your health</div>
              </div>
            )}
          </div>
        )}

        {viewMode === 'list' && (
          <div className="flex flex-col gap-4">
            {entries.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📝</div>
                <div className="empty-state-title">No journal entries yet</div>
                <div className="empty-state-description">Start tracking your daily health</div>
              </div>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>
                        {new Date(entry.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>{getMoodEmoji(entry.mood)}</span>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          Mood: {entry.mood}/10 • Energy: {entry.energy}/10 • Sleep: {entry.sleep}h
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => deleteEntry(entry.id)}
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
                  
                  {entry.notes && (
                    <p style={{ margin: '0 0 0.75rem 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      {entry.notes}
                    </p>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <div><strong>Exercise:</strong> {entry.exercise}m</div>
                    <div><strong>Water:</strong> {entry.water} glasses</div>
                    <div><strong>Stress:</strong> {entry.stress}/10</div>
                    {entry.symptoms.length > 0 && (
                      <div><strong>Symptoms:</strong> {entry.symptoms.length}</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {viewMode === 'chart' && (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <div className="empty-state-title">Charts Coming Soon</div>
            <div className="empty-state-description">Visual charts and trends will be available here</div>
          </div>
        )}
      </div>
    </div>
  );
}
