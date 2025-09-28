import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import './App.css'
import { api } from './api'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Assessment from './pages/Assessment'
import Profile from './pages/Profile'
import AssessmentAnalytics from './components/AssessmentAnalytics'
import HealthGoals from './components/HealthGoals'
import SymptomTracker from './components/SymptomTracker'
import MedicationTracker from './components/MedicationTracker'
import DataExport from './components/DataExport'
import HealthJournal from './components/HealthJournal'
import WellnessTips from './components/WellnessTips'
import HealthChallenges from './components/HealthChallenges'
import HealthReports from './components/HealthReports'

function App() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Khisha Health</h1>
            <p className="auth-subtitle">
              {mode === 'register' ? 'Create your account to get started' : 'Welcome back! Sign in to continue'}
            </p>
          </div>
          
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'register' && (
              <div className="auth-form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}
            
            <div className="auth-form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="auth-form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading"></span>
                  Please wait...
                </>
              ) : (
                mode === 'register' ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>
          
          <div className="auth-switch">
            {mode === 'register' ? (
              <p>
                Already have an account?{' '}
                <button type="button" onClick={() => setMode('login')}>
                  Sign in here
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button type="button" onClick={() => setMode('register')}>
                  Create one here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <AppHeader user={user} onLogout={logout} />
        <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/analytics" element={<AssessmentAnalytics />} />
          <Route path="/goals" element={<HealthGoals />} />
          <Route path="/symptoms" element={<SymptomTracker />} />
          <Route path="/medications" element={<MedicationTracker />} />
          <Route path="/journal" element={<HealthJournal />} />
          <Route path="/tips" element={<WellnessTips />} />
          <Route path="/challenges" element={<HealthChallenges />} />
          <Route path="/reports" element={<HealthReports />} />
          <Route path="/export" element={<DataExport />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

function AppHeader({ user, onLogout }) {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/chat', label: 'Health Chat', icon: '💬' },
    { path: '/assessment', label: 'Assessment', icon: '📋' },
    { path: '/analytics', label: 'Analytics', icon: '📊' },
    { path: '/goals', label: 'Goals', icon: '🎯' },
    { path: '/symptoms', label: 'Symptoms', icon: '🩺' },
    { path: '/medications', label: 'Medications', icon: '💊' },
    { path: '/journal', label: 'Journal', icon: '📝' },
    { path: '/tips', label: 'Tips', icon: '💡' },
    { path: '/challenges', label: 'Challenges', icon: '🏆' },
    { path: '/reports', label: 'Reports', icon: '📊' },
    { path: '/export', label: 'Export', icon: '📤' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <header className="app-header">
      <div className="app-nav">
        <div className="app-nav-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`app-nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
        
        <div className="app-user-info">
          <div className="flex items-center gap-2">
            <div className="dashboard-card-icon primary">
              👤
            </div>
            <div>
              <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                {user.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {user.email}
              </div>
            </div>
          </div>
          <button onClick={onLogout} className="secondary">
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default App
