import { useState, useEffect } from 'react'
import { api } from '../api'

export default function MedicationTracker() {
  const [medications, setMedications] = useState([]);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    instructions: '',
    startDate: '',
    endDate: '',
    reminderTimes: []
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedications();
  }, []);

  async function loadMedications() {
    try {
      setLoading(true);
      // In a real app, this would call the API
      // For now, we'll use mock data
      const mockMedications = [
        {
          id: 1,
          name: 'Vitamin D3',
          dosage: '1000 IU',
          frequency: 'Once daily',
          instructions: 'Take with food',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          reminderTimes: ['08:00'],
          isActive: true,
          createdAt: '2024-01-01'
        },
        {
          id: 2,
          name: 'Omega-3',
          dosage: '1000mg',
          frequency: 'Twice daily',
          instructions: 'Take with meals',
          startDate: '2024-01-15',
          endDate: '2024-06-15',
          reminderTimes: ['08:00', '20:00'],
          isActive: true,
          createdAt: '2024-01-15'
        }
      ];
      setMedications(mockMedications);
    } catch (error) {
      console.error('Error loading medications:', error);
      setMedications([]);
    } finally {
      setLoading(false);
    }
  }

  async function addMedication() {
    if (!newMedication.name.trim() || !newMedication.dosage.trim() || !newMedication.frequency.trim()) return;

    try {
      const medication = {
        id: Date.now(),
        ...newMedication,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0]
      };

      setMedications([medication, ...medications]);
      setNewMedication({
        name: '',
        dosage: '',
        frequency: '',
        instructions: '',
        startDate: '',
        endDate: '',
        reminderTimes: []
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding medication:', error);
      alert('Failed to add medication. Please try again.');
    }
  }

  async function updateMedication(id, updates) {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, ...updates } : med
    ));
  }

  async function deleteMedication(id) {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      setMedications(medications.filter(med => med.id !== id));
    }
  }

  async function markTaken(id) {
    const takenAt = new Date().toISOString();
    // In a real app, this would call the API to log the medication taken
    alert(`Medication marked as taken at ${new Date(takenAt).toLocaleString()}`);
  }

  function addReminderTime() {
    setNewMedication({
      ...newMedication,
      reminderTimes: [...newMedication.reminderTimes, '08:00']
    });
  }

  function updateReminderTime(index, time) {
    const updatedTimes = [...newMedication.reminderTimes];
    updatedTimes[index] = time;
    setNewMedication({
      ...newMedication,
      reminderTimes: updatedTimes
    });
  }

  function removeReminderTime(index) {
    const updatedTimes = newMedication.reminderTimes.filter((_, i) => i !== index);
    setNewMedication({
      ...newMedication,
      reminderTimes: updatedTimes
    });
  }

  function getFrequencyIcon(frequency) {
    const freq = frequency.toLowerCase();
    if (freq.includes('daily') || freq.includes('once')) return '📅';
    if (freq.includes('twice') || freq.includes('2x')) return '📅📅';
    if (freq.includes('three') || freq.includes('3x')) return '📅📅📅';
    if (freq.includes('weekly')) return '📆';
    if (freq.includes('monthly')) return '🗓️';
    return '💊';
  }

  function getStatusColor(medication) {
    const today = new Date();
    const endDate = medication.endDate ? new Date(medication.endDate) : null;
    
    if (!medication.isActive) return 'var(--text-muted)';
    if (endDate && endDate < today) return 'var(--error)';
    if (endDate && endDate < new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) return 'var(--warning)';
    return 'var(--success)';
  }

  const activeMedications = medications.filter(med => med.isActive);
  const expiredMedications = medications.filter(med => 
    med.endDate && new Date(med.endDate) < new Date()
  );

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center" style={{ minHeight: '200px' }}>
          <div className="loading"></div>
          <span style={{ marginLeft: '1rem' }}>Loading medications...</span>
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
            <h3 className="dashboard-card-title">Active Medications</h3>
            <div className="dashboard-card-icon primary">💊</div>
          </div>
          <div className="dashboard-card-value">{activeMedications.length}</div>
          <p className="dashboard-card-content">Currently taking</p>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Total Medications</h3>
            <div className="dashboard-card-icon success">📋</div>
          </div>
          <div className="dashboard-card-value">{medications.length}</div>
          <p className="dashboard-card-content">All medications tracked</p>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Expiring Soon</h3>
            <div className="dashboard-card-icon warning">⚠️</div>
          </div>
          <div className="dashboard-card-value">{expiredMedications.length}</div>
          <p className="dashboard-card-content">Need attention</p>
        </div>
      </div>

      {/* Add Medication Form */}
      <div className="card mb-6">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className="card-title">Medication Tracker</h2>
              <p className="text-muted">Track your medications, supplements, and reminders</p>
            </div>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="primary"
            >
              {showAddForm ? 'Cancel' : '+ Add Medication'}
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
                <label>Medication Name</label>
                <input
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                  placeholder="e.g., Vitamin D3, Ibuprofen"
                />
              </div>
              <div>
                <label>Dosage</label>
                <input
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                  placeholder="e.g., 1000mg, 2 tablets"
                />
              </div>
              <div>
                <label>Frequency</label>
                <select
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
                >
                  <option value="">Select frequency</option>
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="Every 4 hours">Every 4 hours</option>
                  <option value="Every 6 hours">Every 6 hours</option>
                  <option value="Every 8 hours">Every 8 hours</option>
                  <option value="Every 12 hours">Every 12 hours</option>
                  <option value="As needed">As needed</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label>Start Date</label>
                <input
                  type="date"
                  value={newMedication.startDate}
                  onChange={(e) => setNewMedication({...newMedication, startDate: e.target.value})}
                />
              </div>
              <div>
                <label>End Date (Optional)</label>
                <input
                  type="date"
                  value={newMedication.endDate}
                  onChange={(e) => setNewMedication({...newMedication, endDate: e.target.value})}
                />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Instructions</label>
              <textarea
                value={newMedication.instructions}
                onChange={(e) => setNewMedication({...newMedication, instructions: e.target.value})}
                placeholder="Special instructions (e.g., Take with food, Avoid alcohol)"
                rows={3}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Reminder Times</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {newMedication.reminderTimes.map((time, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => updateReminderTime(index, e.target.value)}
                    />
                    <button 
                      onClick={() => removeReminderTime(index)}
                      style={{ 
                        background: 'var(--error)', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '50%', 
                        width: '24px', 
                        height: '24px',
                        cursor: 'pointer'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button 
                  onClick={addReminderTime}
                  style={{ 
                    background: 'var(--accent-primary)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 'var(--radius-md)', 
                    padding: '0.5rem 1rem',
                    cursor: 'pointer'
                  }}
                >
                  + Add Time
                </button>
              </div>
            </div>
            <button onClick={addMedication} className="primary">
              Add Medication
            </button>
          </div>
        )}
      </div>

      {/* Medications List */}
      <div className="flex flex-col gap-4">
        {medications.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">💊</div>
              <div className="empty-state-title">No medications tracked yet</div>
              <div className="empty-state-description">Add your first medication to get started</div>
            </div>
          </div>
        ) : (
          medications.map((medication) => (
            <div key={medication.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '2rem' }}>{getFrequencyIcon(medication.frequency)}</div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>
                      {medication.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {medication.dosage}
                      </span>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {medication.frequency}
                      </span>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        color: getStatusColor(medication),
                        fontWeight: 600,
                        padding: '0.25rem 0.5rem',
                        backgroundColor: getStatusColor(medication) + '20',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        {medication.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button 
                    onClick={() => markTaken(medication.id)}
                    className="secondary"
                    style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                  >
                    Mark Taken
                  </button>
                  <button 
                    onClick={() => updateMedication(medication.id, { isActive: !medication.isActive })}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: medication.isActive ? 'var(--warning)' : 'var(--success)', 
                      cursor: 'pointer',
                      padding: '0.25rem'
                    }}
                  >
                    {medication.isActive ? '⏸️' : '▶️'}
                  </button>
                  <button 
                    onClick={() => deleteMedication(medication.id)}
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

              {medication.instructions && (
                <p style={{ margin: '0 0 0.75rem 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  <strong>Instructions:</strong> {medication.instructions}
                </p>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '0.75rem' }}>
                {medication.startDate && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <strong>Start:</strong> {new Date(medication.startDate).toLocaleDateString()}
                  </div>
                )}
                {medication.endDate && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <strong>End:</strong> {new Date(medication.endDate).toLocaleDateString()}
                  </div>
                )}
                {medication.reminderTimes && medication.reminderTimes.length > 0 && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <strong>Reminders:</strong> {JSON.parse(medication.reminderTimes || '[]').join(', ')}
                  </div>
                )}
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Added: {new Date(medication.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
