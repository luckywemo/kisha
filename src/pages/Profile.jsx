import { useEffect, useState } from 'react'
import { api } from '../api'

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      const res = await api.getProfile();
      setUser(res.user);
    } catch (error) {
      console.error('Error loading profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile() {
    const nameToSave = (editName !== '' ? editName : user.name).trim();
    if (!nameToSave) return;
    
    setSaving(true);
    try {
      const res = await api.updateProfile({ name: nameToSave });
      setUser(res.user);
      setEditName('');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center" style={{ minHeight: '200px' }}>
          <div className="loading"></div>
          <span style={{ marginLeft: '1rem' }}>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-state-icon">👤</div>
          <div className="empty-state-title">Please login first</div>
          <div className="empty-state-description">You need to be logged in to view your profile</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Profile Settings</h1>
          <p className="text-muted">Manage your account information and preferences</p>
        </div>

        <div className="profile-form">
          {/* User Info Display */}
          <div className="profile-field">
            <label>Account Information</label>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'var(--bg-secondary)', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Email:</strong> {user.email}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                This is your login email and cannot be changed
              </div>
            </div>
          </div>

          {/* Name Editing */}
          <div className="profile-field">
            <label htmlFor="displayName">Display Name</label>
            <div className="profile-actions">
              <input
                id="displayName"
                type="text"
                value={editName !== '' ? editName : user.name}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter your display name"
                style={{ flex: 1 }}
              />
              <button
                onClick={saveProfile}
                disabled={saving || (editName !== '' ? editName : user.name).trim() === user.name}
                className="primary"
                style={{ minWidth: '100px' }}
              >
                {saving ? (
                  <>
                    <span className="loading"></span>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              This name will be displayed throughout the application
            </div>
          </div>

          {/* Account Stats */}
          <div className="profile-field">
            <label>Account Statistics</label>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '1rem',
              marginTop: '0.5rem'
            }}>
              <div style={{ 
                padding: '1rem', 
                backgroundColor: 'var(--bg-secondary)', 
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                  {user.id}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  User ID
                </div>
              </div>
              <div style={{ 
                padding: '1rem', 
                backgroundColor: 'var(--bg-secondary)', 
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--success)' }}>
                  Active
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Account Status
                </div>
              </div>
            </div>
          </div>

          {/* Health Preferences */}
          <div className="profile-field">
            <label>Health Preferences</label>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'var(--bg-secondary)', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ marginBottom: '0.75rem', fontWeight: 500 }}>
                Notification Settings
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <input type="checkbox" defaultChecked style={{ margin: 0 }} />
                  Health assessment reminders
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <input type="checkbox" defaultChecked style={{ margin: 0 }} />
                  Weekly health tips
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <input type="checkbox" style={{ margin: 0 }} />
                  Chat notifications
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


