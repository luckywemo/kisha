import { useState, useEffect } from 'react'
import { api } from '../api'

export default function HealthChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [userStats, setUserStats] = useState({
    totalPoints: 1250,
    level: 5,
    streak: 12,
    completedChallenges: 8
  });

  useEffect(() => {
    loadChallenges();
    loadAchievements();
  }, []);

  async function loadChallenges() {
    try {
      const serverChallenges = await api.listChallenges();
      const normalized = serverChallenges.map(c => ({
        id: c.id,
        title: c.title,
        description: c.description,
        category: c.category,
        difficulty: c.points >= 300 ? 'hard' : c.points >= 180 ? 'medium' : 'easy',
        duration: c.duration,
        points: c.points,
        requirements: Array.isArray(c.requirements) ? c.requirements : (c.requirements || []),
        rewards: ['Challenge Points', 'Achievement Progress'],
        isActive: c.isActive,
        participants: 0,
        startDate: null,
        endDate: null
      }));
      setChallenges(normalized);
    } catch (_) {
      const mockChallenges = [
      {
        id: 1,
        title: '7-Day Hydration Challenge',
        description: 'Drink 8 glasses of water every day for a week',
        category: 'nutrition',
        difficulty: 'easy',
        duration: 7,
        points: 100,
        requirements: {
          daily: { water: 8 },
          total: { days: 7 }
        },
        rewards: ['Hydration Master Badge', '50 bonus points'],
        isActive: true,
        participants: 1247,
        startDate: '2024-01-15',
        endDate: '2024-01-22'
      },
      {
        id: 2,
        title: '30-Day Fitness Streak',
        description: 'Complete at least 30 minutes of exercise every day for a month',
        category: 'exercise',
        difficulty: 'hard',
        duration: 30,
        points: 500,
        requirements: {
          daily: { exercise: 30 },
          total: { days: 30 }
        },
        rewards: ['Fitness Warrior Badge', '200 bonus points', 'Premium features for 1 month'],
        isActive: true,
        participants: 892,
        startDate: '2024-01-01',
        endDate: '2024-01-31'
      },
      {
        id: 3,
        title: 'Mindful Morning Routine',
        description: 'Start each day with 10 minutes of meditation or mindfulness',
        category: 'mental-health',
        difficulty: 'medium',
        duration: 14,
        points: 200,
        requirements: {
          daily: { meditation: 10 },
          total: { days: 14 }
        },
        rewards: ['Zen Master Badge', '100 bonus points'],
        isActive: true,
        participants: 2156,
        startDate: '2024-01-10',
        endDate: '2024-01-24'
      },
      {
        id: 4,
        title: 'Sleep Quality Improvement',
        description: 'Maintain consistent sleep schedule and 7+ hours nightly',
        category: 'sleep',
        difficulty: 'medium',
        duration: 21,
        points: 300,
        requirements: {
          daily: { sleep: 7, consistency: true },
          total: { days: 21 }
        },
        rewards: ['Sleep Champion Badge', '150 bonus points'],
        isActive: true,
        participants: 1834,
        startDate: '2024-01-08',
        endDate: '2024-01-29'
      },
      {
        id: 5,
        title: 'Healthy Meal Prep',
        description: 'Prepare and eat 5 healthy home-cooked meals per week',
        category: 'nutrition',
        difficulty: 'medium',
        duration: 14,
        points: 250,
        requirements: {
          weekly: { meals: 5 },
          total: { weeks: 2 }
        },
        rewards: ['Chef Master Badge', '125 bonus points'],
        isActive: true,
        participants: 967,
        startDate: '2024-01-12',
        endDate: '2024-01-26'
      },
      {
        id: 6,
        title: 'Digital Detox Weekend',
        description: 'Spend 48 hours without social media and limit screen time',
        category: 'mental-health',
        difficulty: 'hard',
        duration: 2,
        points: 150,
        requirements: {
          daily: { screenTime: 2 },
          total: { days: 2 }
        },
        rewards: ['Digital Minimalist Badge', '75 bonus points'],
        isActive: false,
        participants: 445,
        startDate: '2024-01-20',
        endDate: '2024-01-22'
      }
      ];
      setChallenges(mockChallenges);
    }
  }

  function loadAchievements() {
    const mockAchievements = [
      {
        id: 1,
        title: 'First Steps',
        description: 'Complete your first health assessment',
        icon: '👶',
        points: 50,
        unlockedAt: '2024-01-05',
        rarity: 'common'
      },
      {
        id: 2,
        title: 'Chat Master',
        description: 'Have 10 conversations with the health assistant',
        icon: '💬',
        points: 100,
        unlockedAt: '2024-01-10',
        rarity: 'common'
      },
      {
        id: 3,
        title: 'Streak Keeper',
        description: 'Maintain a 7-day journaling streak',
        icon: '🔥',
        points: 200,
        unlockedAt: '2024-01-15',
        rarity: 'uncommon'
      },
      {
        id: 4,
        title: 'Assessment Pro',
        description: 'Complete 10 health assessments',
        icon: '📋',
        points: 300,
        unlockedAt: '2024-01-12',
        rarity: 'uncommon'
      },
      {
        id: 5,
        title: 'Wellness Warrior',
        description: 'Complete 5 different health challenges',
        icon: '🏆',
        points: 500,
        unlockedAt: '2024-01-18',
        rarity: 'rare'
      },
      {
        id: 6,
        title: 'Health Guru',
        description: 'Reach level 10 in the wellness program',
        icon: '🎓',
        points: 1000,
        unlockedAt: null,
        rarity: 'epic'
      }
    ];
    setAchievements(mockAchievements);
  }

  async function joinChallenge(challengeId) {
    try {
      await api.joinChallenge({ id: challengeId });
    } catch (_) {
      // ignore join errors for now
    }
    setUserProgress(prev => ({
      ...prev,
      [challengeId]: {
        joinedAt: new Date().toISOString(),
        progress: 0,
        completed: false
      }
    }));
  }

  function updateChallengeProgress(challengeId, progress) {
    setUserProgress(prev => ({
      ...prev,
      [challengeId]: {
        ...prev[challengeId],
        progress: Math.min(progress, 100)
      }
    }));
  }

  function getDifficultyColor(difficulty) {
    const colors = {
      'easy': 'var(--success)',
      'medium': 'var(--warning)',
      'hard': 'var(--error)'
    };
    return colors[difficulty] || 'var(--text-muted)';
  }

  function getRarityColor(rarity) {
    const colors = {
      'common': 'var(--text-muted)',
      'uncommon': 'var(--success)',
      'rare': 'var(--accent-primary)',
      'epic': 'var(--warning)',
      'legendary': 'var(--error)'
    };
    return colors[rarity] || 'var(--text-muted)';
  }

  function getCategoryIcon(category) {
    const icons = {
      'nutrition': '🥗',
      'exercise': '🏃‍♂️',
      'mental-health': '🧘‍♀️',
      'sleep': '😴',
      'general': '💪'
    };
    return icons[category] || '💪';
  }

  function calculateLevel(points) {
    return Math.floor(points / 250) + 1;
  }

  function getNextLevelPoints(currentLevel) {
    return (currentLevel * 250) - userStats.totalPoints;
  }

  const activeChallenges = challenges.filter(c => c.isActive);
  const userChallenges = challenges.filter(c => userProgress[c.id]);
  const unlockedAchievements = achievements.filter(a => a.unlockedAt);
  const lockedAchievements = achievements.filter(a => !a.unlockedAt);

  return (
    <div>
      {/* User Stats Overview */}
      <div className="dashboard-grid mb-6">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Level</h3>
            <div className="dashboard-card-icon primary">🎯</div>
          </div>
          <div className="dashboard-card-value">{userStats.level}</div>
          <p className="dashboard-card-content">
            {getNextLevelPoints(userStats.level)} points to next level
          </p>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Total Points</h3>
            <div className="dashboard-card-icon success">⭐</div>
          </div>
          <div className="dashboard-card-value">{userStats.totalPoints}</div>
          <p className="dashboard-card-content">Points earned</p>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Current Streak</h3>
            <div className="dashboard-card-icon warning">🔥</div>
          </div>
          <div className="dashboard-card-value">{userStats.streak}</div>
          <p className="dashboard-card-content">Days in a row</p>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Completed</h3>
            <div className="dashboard-card-icon error">🏆</div>
          </div>
          <div className="dashboard-card-value">{userStats.completedChallenges}</div>
          <p className="dashboard-card-content">Challenges finished</p>
        </div>
      </div>

      {/* Active Challenges */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="card-title">Active Challenges</h2>
          <p className="text-muted">Join challenges to earn points and unlock achievements</p>
        </div>
        <div className="dashboard-grid">
          {activeChallenges.map((challenge) => {
            const userChallenge = userProgress[challenge.id];
            const progress = userChallenge ? userChallenge.progress : 0;
            
            return (
              <div key={challenge.id} className="dashboard-card">
                <div className="dashboard-card-header">
                  <h3 className="dashboard-card-title">{challenge.title}</h3>
                  <div className="dashboard-card-icon" style={{ fontSize: '1.5rem' }}>
                    {getCategoryIcon(challenge.category)}
                  </div>
                </div>
                
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {challenge.description}
                </p>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {challenge.duration} days • {challenge.points} points
                    </span>
                    <span className={`badge ${challenge.difficulty === 'easy' ? 'success' : challenge.difficulty === 'medium' ? 'warning' : 'error'}`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  
                  {userChallenge ? (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Progress</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{progress}%</span>
                      </div>
                      <div style={{ height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${progress}%`, 
                          height: '100%', 
                          backgroundColor: 'var(--accent-primary)', 
                          transition: 'width 0.3s ease' 
                        }}></div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      {challenge.participants.toLocaleString()} participants
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', fontWeight: 600 }}>Rewards:</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                    {challenge.rewards.map((reward, index) => (
                      <span key={index} style={{ 
                        fontSize: '0.75rem', 
                        backgroundColor: 'var(--accent-light)', 
                        color: 'var(--accent-primary)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        {reward}
                      </span>
                    ))}
                  </div>
                </div>

                {userChallenge ? (
                  <button 
                    className="secondary"
                    style={{ width: '100%', fontSize: '0.875rem' }}
                    onClick={() => setSelectedChallenge(challenge)}
                  >
                    View Details
                  </button>
                ) : (
                  <button 
                    className="primary"
                    style={{ width: '100%', fontSize: '0.875rem' }}
                    onClick={() => joinChallenge(challenge.id)}
                  >
                    Join Challenge
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* My Challenges */}
      {userChallenges.length > 0 && (
        <div className="card mb-6">
          <div className="card-header">
            <h2 className="card-title">My Challenges</h2>
            <p className="text-muted">Track your progress in joined challenges</p>
          </div>
          <div className="flex flex-col gap-4">
            {userChallenges.map((challenge) => {
              const userChallenge = userProgress[challenge.id];
              return (
                <div key={challenge.id} className="card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: 600 }}>
                        {challenge.title}
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {challenge.description}
                      </p>
                    </div>
                    <span className={`badge ${challenge.difficulty === 'easy' ? 'success' : challenge.difficulty === 'medium' ? 'warning' : 'error'}`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Progress</span>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        {userChallenge.progress}% • {challenge.points} points
                      </span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${userChallenge.progress}%`, 
                        height: '100%', 
                        backgroundColor: 'var(--accent-primary)', 
                        transition: 'width 0.3s ease' 
                      }}></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Joined {new Date(userChallenge.joinedAt).toLocaleDateString()}
                    </span>
                    <button 
                      className="primary"
                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                      onClick={() => setSelectedChallenge(challenge)}
                    >
                      Update Progress
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Achievements</h2>
          <p className="text-muted">Unlock achievements by completing challenges and activities</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[...unlockedAchievements, ...lockedAchievements].map((achievement) => (
            <div 
              key={achievement.id} 
              className="card" 
              style={{ 
                padding: '1rem', 
                textAlign: 'center',
                opacity: achievement.unlockedAt ? 1 : 0.6,
                backgroundColor: achievement.unlockedAt ? 'var(--bg-primary)' : 'var(--bg-secondary)'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {achievement.unlockedAt ? achievement.icon : '🔒'}
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 600 }}>
                {achievement.title}
              </h3>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {achievement.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  color: getRarityColor(achievement.rarity)
                }}>
                  {achievement.points} pts
                </span>
                <span style={{ 
                  fontSize: '0.75rem', 
                  backgroundColor: getRarityColor(achievement.rarity),
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  {achievement.rarity}
                </span>
              </div>
              {achievement.unlockedAt && (
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Challenge Detail Modal */}
      {selectedChallenge && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
            <div className="card-header">
              <h2 className="card-title">{selectedChallenge.title}</h2>
              <button 
                onClick={() => setSelectedChallenge(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '1rem' }}>
              <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                {selectedChallenge.description}
              </p>
              
              <div style={{ marginBottom: '1rem' }}>
                <h4>Requirements:</h4>
                <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                  {Object.entries(selectedChallenge.requirements).map(([key, value]) => (
                    <li key={key} style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                      {key}: {typeof value === 'object' ? JSON.stringify(value) : value}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h4>Rewards:</h4>
                <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                  {selectedChallenge.rewards.map((reward, index) => (
                    <li key={index} style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                      {reward}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className="primary"
                  onClick={() => {
                    joinChallenge(selectedChallenge.id);
                    setSelectedChallenge(null);
                  }}
                >
                  Join Challenge
                </button>
                <button 
                  className="secondary"
                  onClick={() => setSelectedChallenge(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
