import { useState, useEffect } from 'react'

export default function SymptomTracker() {
  const [symptoms, setSymptoms] = useState([]);
  const [newSymptom, setNewSymptom] = useState({
    name: '',
    severity: 5,
    location: '',
    description: '',
    triggers: '',
    duration: '',
    notes: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    loadSymptoms();
  }, []);

  function loadSymptoms() {
    // In a real app, this would load from the backend
    const mockSymptoms = [
      {
        id: 1,
        name: 'Headache',
        severity: 7,
        location: 'Frontal',
        description: 'Throbbing pain in forehead',
        triggers: 'Stress, lack of sleep',
        duration: '2 hours',
        notes: 'Started after long work day',
        category: 'pain',
        createdAt: new Date().toISOString(),
        frequency: 'daily'
      },
      {
        id: 2,
        name: 'Fatigue',
        severity: 6,
        location: 'General',
        description: 'Feeling tired and low energy',
        triggers: 'Poor sleep quality',
        duration: 'All day',
        notes: 'Difficulty concentrating',
        category: 'energy',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        frequency: 'daily'
      },
      {
        id: 3,
        name: 'Joint Stiffness',
        severity: 4,
        location: 'Knees',
        description: 'Stiffness in knee joints',
        triggers: 'Cold weather, inactivity',
        duration: '30 minutes',
        notes: 'Worse in the morning',
        category: 'pain',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        frequency: 'weekly'
      }
    ];
    setSymptoms(mockSymptoms);
  }

  function addSymptom() {
    if (!newSymptom.name.trim()) return;

    const symptom = {
      id: Date.now(),
      ...newSymptom,
      createdAt: new Date().toISOString(),
      frequency: 'once' // This would be determined by tracking over time
    };

    setSymptoms([symptom, ...symptoms]);
    setNewSymptom({
      name: '',
      severity: 5,
      location: '',
      description: '',
      triggers: '',
      duration: '',
      notes: ''
    });
    setShowAddForm(false);
  }

  function deleteSymptom(symptomId) {
    setSymptoms(symptoms.filter(symptom => symptom.id !== symptomId));
  }

  function getSeverityColor(severity) {
    if (severity >= 8) return 'var(--error)';
    if (severity >= 6) return 'var(--warning)';
    if (severity >= 4) return '#f59e0b';
    return 'var(--success)';
  }

  function getSeverityLabel(severity) {
    if (severity >= 8) return 'Severe';
    if (severity >= 6) return 'Moderate';
    if (severity >= 4) return 'Mild';
    return 'Minimal';
  }

  function getCategoryIcon(category) {
    const icons = {
      'pain': '🩺',
      'energy': '⚡',
      'mood': '😊',
      'sleep': '😴',
      'digestive': '🍽️',
      'respiratory': '🫁',
      'skin': '🦠',
      'neurological': '🧠',
      'other': '📝'
    };
    return icons[category] || '📝';
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  const filteredSymptoms = filterCategory === 'all' 
    ? symptoms 
    : symptoms.filter(symptom => symptom.category === filterCategory);

  const categories = [
    { value: 'all', label: 'All Symptoms', icon: '📋' },
    { value: 'pain', label: 'Pain', icon: '🩺' },
    { value: 'energy', label: 'Energy', icon: '⚡' },
    { value: 'mood', label: 'Mood', icon: '😊' },
    { value: 'sleep', label: 'Sleep', icon: '😴' },
    { value: 'digestive', label: 'Digestive', icon: '🍽️' },
    { value: 'respiratory', label: 'Respiratory', icon: '🫁' },
    { value: 'skin', label: 'Skin', icon: '🦠' },
    { value: 'neurological', label: 'Neurological', icon: '🧠' },
    { value: 'other', label: 'Other', icon: '📝' }
  ];

  return (
    <div>
      {/* Overview Cards */}
      <div className="dashboard-grid mb-6">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Total Symptoms</h3>
            <div className="dashboard-card-icon primary">📝</div>
          </div>
          <div className="dashboard-card-value">{symptoms.length}</div>
          <p className="dashboard-card-content">Symptoms tracked</p>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Average Severity</h3>
            <div className="dashboard-card-icon warning">📊</div>
          </div>
          <div className="dashboard-card-value">
            {symptoms.length > 0 ? 
              (symptoms.reduce((sum, s) => sum + s.severity, 0) / symptoms.length).toFixed(1) : 
              '0'
            }
          </div>
          <p className="dashboard-card-content">Out of 10 scale</p>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Most Common</h3>
            <div className="dashboard-card-icon success">📈</div>
          </div>
          <div className="dashboard-card-value">
            {symptoms.length > 0 ? 
              (() => {
                const categoryCount = {};
                symptoms.forEach(s => {
                  categoryCount[s.category] = (categoryCount[s.category] || 0) + 1;
                });
                const mostCommon = Object.keys(categoryCount).reduce((a, b) => 
                  categoryCount[a] > categoryCount[b] ? a : b
                );
                return categories.find(c => c.value === mostCommon)?.icon || '📝';
              })() : 'N/A'
            }
          </div>
          <p className="dashboard-card-content">Symptom category</p>
        </div>
      </div>

      {/* Add Symptom Form */}
      <div className="card mb-6">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className="card-title">Symptom Tracker</h2>
              <p className="text-muted">Track and monitor your health symptoms</p>
            </div>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="primary"
            >
              {showAddForm ? 'Cancel' : '+ Add Symptom'}
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
                <label>Symptom Name</label>
                <input
                  value={newSymptom.name}
                  onChange={(e) => setNewSymptom({...newSymptom, name: e.target.value})}
                  placeholder="e.g., Headache, Fatigue"
                />
              </div>
              <div>
                <label>Severity (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newSymptom.severity}
                  onChange={(e) => setNewSymptom({...newSymptom, severity: parseInt(e.target.value)})}
                />
                <div style={{ textAlign: 'center', marginTop: '0.25rem', fontWeight: 600, color: getSeverityColor(newSymptom.severity) }}>
                  {newSymptom.severity} - {getSeverityLabel(newSymptom.severity)}
                </div>
              </div>
              <div>
                <label>Location</label>
                <input
                  value={newSymptom.location}
                  onChange={(e) => setNewSymptom({...newSymptom, location: e.target.value})}
                  placeholder="e.g., Head, Chest, Back"
                />
              </div>
              <div>
                <label>Duration</label>
                <input
                  value={newSymptom.duration}
                  onChange={(e) => setNewSymptom({...newSymptom, duration: e.target.value})}
                  placeholder="e.g., 2 hours, All day"
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label>Description</label>
                <textarea
                  value={newSymptom.description}
                  onChange={(e) => setNewSymptom({...newSymptom, description: e.target.value})}
                  placeholder="Describe the symptom in detail..."
                  rows={3}
                />
              </div>
              <div>
                <label>Triggers</label>
                <textarea
                  value={newSymptom.triggers}
                  onChange={(e) => setNewSymptom({...newSymptom, triggers: e.target.value})}
                  placeholder="What might have caused this?"
                  rows={3}
                />
              </div>
            </div>
            <div>
              <label>Additional Notes</label>
              <textarea
                value={newSymptom.notes}
                onChange={(e) => setNewSymptom({...newSymptom, notes: e.target.value})}
                placeholder="Any other relevant information..."
                rows={2}
              />
            </div>
            <button onClick={addSymptom} className="primary" style={{ marginTop: '1rem' }}>
              Add Symptom
            </button>
          </div>
        )}
      </div>

      {/* Filter Categories */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="card-title">Filter by Category</h3>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setFilterCategory(category.value)}
              className={filterCategory === category.value ? 'primary' : 'secondary'}
              style={{ fontSize: '0.875rem' }}
            >
              <span style={{ marginRight: '0.5rem' }}>{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Symptoms List */}
      <div className="flex flex-col gap-4">
        {filteredSymptoms.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <div className="empty-state-title">No symptoms tracked yet</div>
              <div className="empty-state-description">Add your first symptom to start tracking</div>
            </div>
          </div>
        ) : (
          filteredSymptoms.map((symptom) => (
            <div key={symptom.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '2rem' }}>{getCategoryIcon(symptom.category)}</div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>
                      {symptom.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        color: getSeverityColor(symptom.severity),
                        fontWeight: 600,
                        padding: '0.25rem 0.5rem',
                        backgroundColor: getSeverityColor(symptom.severity) + '20',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        Severity: {symptom.severity}/10 - {getSeverityLabel(symptom.severity)}
                      </span>
                      {symptom.location && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Location: {symptom.location}
                        </span>
                      )}
                      {symptom.duration && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Duration: {symptom.duration}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => deleteSymptom(symptom.id)}
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

              {symptom.description && (
                <p style={{ margin: '0 0 0.75rem 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  <strong>Description:</strong> {symptom.description}
                </p>
              )}

              {symptom.triggers && (
                <p style={{ margin: '0 0 0.75rem 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  <strong>Triggers:</strong> {symptom.triggers}
                </p>
              )}

              {symptom.notes && (
                <p style={{ margin: '0 0 0.75rem 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  <strong>Notes:</strong> {symptom.notes}
                </p>
              )}

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Tracked: {formatDate(symptom.createdAt)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
