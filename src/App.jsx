import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import './App.css'
import { api } from './api'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Assessment from './pages/Assessment'
import Profile from './pages/Profile'

function App() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getProfile().then((res) => setUser(res.user)).catch(() => {});
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        const res = await api.register({ name, email, password });
        localStorage.setItem('token', res.token);
        setUser(res.user);
      } else {
        const res = await api.login({ email, password });
        localStorage.setItem('token', res.token);
        setUser(res.user);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  if (!user) {
    return (
      <div className="card" style={{ maxWidth: 420, margin: '40px auto' }}>
        <h2>{mode === 'register' ? 'Create account' : 'Sign in'}</h2>
        {error ? <div style={{ color: 'red', marginBottom: 8 }}>{error}</div> : null}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div style={{ marginBottom: 8 }}>
              <label>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div style={{ marginBottom: 8 }}>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading}>{loading ? 'Please wait...' : (mode === 'register' ? 'Register' : 'Login')}</button>
        </form>
        <div style={{ marginTop: 12 }}>
          {mode === 'register' ? (
            <button onClick={() => setMode('login')}>Have an account? Sign in</button>
          ) : (
            <button onClick={() => setMode('register')}>Need an account? Register</button>
          )}
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div style={{ maxWidth: 960, margin: '24px auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <nav style={{ display: 'flex', gap: 12 }}>
            <Link to="/">Home</Link>
            <Link to="/chat">Chat</Link>
            <Link to="/assessment">Assessment</Link>
            <Link to="/profile">Profile</Link>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>{user.name}</span>
            <button onClick={logout}>Logout</button>
          </div>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
