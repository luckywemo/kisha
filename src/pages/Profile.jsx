import { useEffect, useState } from 'react'
import { api } from '../api'

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getProfile().then((res) => setUser(res.user)).catch(() => setUser(null));
  }, []);

  if (!user) return <div className="card" style={{ maxWidth: 720, margin: '20px auto' }}><p>Please login first.</p></div>

  return (
    <div className="card" style={{ maxWidth: 720, margin: '20px auto' }}>
      <h2 style={{ marginTop: 0 }}>Profile</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <div style={{ marginTop: 12 }}>
        <label>Display name</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={editName !== '' ? editName : user.name} onChange={(e) => setEditName(e.target.value)} />
          <button
            onClick={async () => {
              const nameToSave = (editName !== '' ? editName : user.name).trim();
              if (!nameToSave) return;
              setSaving(true);
              try {
                const res = await api.updateProfile({ name: nameToSave });
                setUser(res.user);
                setEditName('');
              } catch (e) {
                alert(e.message || 'Failed to update profile');
              } finally {
                setSaving(false);
              }
            }}
            disabled={saving}
          >{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}


