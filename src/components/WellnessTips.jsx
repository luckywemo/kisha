import { useState, useEffect } from 'react'

export default function WellnessTips() {
  const [tips, setTips] = useState([]);
  const [filteredTips, setFilteredTips] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userProfile, setUserProfile] = useState({
    age: 30,
    activityLevel: 'moderate',
    healthGoals: ['fitness', 'nutrition', 'sleep'],
    interests: ['exercise', 'meditation', 'cooking']
  });

  useEffect(() => {
    loadWellnessTips();
  }, []);

  function loadWellnessTips() {
    const mockTips = [
      {
        id: 1,
        title: 'Morning Hydration Routine',
        category: 'nutrition',
        difficulty: 'easy',
        duration: '5 minutes',
        description: 'Start your day with a glass of water to kickstart your metabolism and rehydrate after sleep.',
        content: 'Drink 16-20 ounces of water first thing in the morning. Add a slice of lemon for extra benefits. This helps flush toxins, boost energy, and improve digestion.',
        benefits: ['Improved hydration', 'Better digestion', 'Increased energy', 'Clearer skin'],
        steps: [
          'Keep a glass of water by your bedside',
          'Drink it immediately upon waking',
          'Wait 30 minutes before eating breakfast',
          'Continue drinking water throughout the day'
        ],
        tags: ['hydration', 'morning routine', 'digestion'],
        isPersonalized: true
      },
      {
        id: 2,
        title: '10-Minute Morning Stretch',
        category: 'exercise',
        difficulty: 'easy',
        duration: '10 minutes',
        description: 'A gentle morning stretch routine to wake up your body and improve flexibility.',
        content: 'Start your day with gentle stretches to improve circulation, reduce muscle tension, and increase energy levels.',
        benefits: ['Improved flexibility', 'Better posture', 'Reduced muscle tension', 'Increased energy'],
        steps: [
          'Neck rolls: Slowly roll your head in circles',
          'Shoulder shrugs: Lift and lower your shoulders',
          'Cat-cow stretch: On hands and knees, arch and round your back',
          'Forward fold: Bend forward and let your arms hang',
          'Hip circles: Standing, make circles with your hips'
        ],
        tags: ['stretching', 'morning routine', 'flexibility'],
        isPersonalized: true
      },
      {
        id: 3,
        title: 'Digital Sunset Routine',
        category: 'sleep',
        difficulty: 'medium',
        duration: '30 minutes',
        description: 'Create a technology-free wind-down routine to improve sleep quality.',
        content: 'Reduce blue light exposure and create a calming bedtime routine to signal to your body that it\'s time to sleep.',
        benefits: ['Better sleep quality', 'Reduced eye strain', 'Less anxiety', 'Improved circadian rhythm'],
        steps: [
          'Turn off all screens 1 hour before bed',
          'Dim the lights in your home',
          'Read a book or practice meditation',
          'Write in a gratitude journal',
          'Do gentle stretching or breathing exercises'
        ],
        tags: ['sleep hygiene', 'digital detox', 'evening routine'],
        isPersonalized: false
      },
      {
        id: 4,
        title: 'Mindful Eating Practice',
        category: 'nutrition',
        difficulty: 'medium',
        duration: '20 minutes',
        description: 'Learn to eat mindfully to improve digestion and relationship with food.',
        content: 'Practice being present while eating to better tune into hunger cues and enjoy your meals more fully.',
        benefits: ['Better digestion', 'Improved portion control', 'Reduced overeating', 'Greater food satisfaction'],
        steps: [
          'Eat without distractions (no TV, phone, or computer)',
          'Take small bites and chew slowly',
          'Pay attention to the taste, texture, and smell',
          'Pause between bites',
          'Stop when you feel 80% full'
        ],
        tags: ['mindful eating', 'digestion', 'portion control'],
        isPersonalized: true
      },
      {
        id: 5,
        title: '5-Minute Breathing Meditation',
        category: 'mental-health',
        difficulty: 'easy',
        duration: '5 minutes',
        description: 'A simple breathing exercise to reduce stress and improve focus.',
        content: 'Use controlled breathing to activate your parasympathetic nervous system and reduce stress hormones.',
        benefits: ['Reduced stress', 'Improved focus', 'Lower blood pressure', 'Better emotional regulation'],
        steps: [
          'Find a comfortable seated position',
          'Close your eyes and relax your shoulders',
          'Breathe in for 4 counts',
          'Hold your breath for 4 counts',
          'Breathe out for 6 counts',
          'Repeat for 5 minutes'
        ],
        tags: ['meditation', 'breathing', 'stress relief'],
        isPersonalized: true
      },
      {
        id: 6,
        title: 'Progressive Muscle Relaxation',
        category: 'mental-health',
        difficulty: 'medium',
        duration: '15 minutes',
        description: 'A technique to release physical tension and promote relaxation.',
        content: 'Systematically tense and relax different muscle groups to reduce physical stress and promote deep relaxation.',
        benefits: ['Reduced muscle tension', 'Better sleep', 'Lower anxiety', 'Improved body awareness'],
        steps: [
          'Lie down in a comfortable position',
          'Start with your toes, tense for 5 seconds, then relax',
          'Move up to your calves, tense and relax',
          'Continue with thighs, abdomen, arms, shoulders, and face',
          'End with full body relaxation for 5 minutes'
        ],
        tags: ['relaxation', 'stress relief', 'sleep'],
        isPersonalized: false
      },
      {
        id: 7,
        title: 'Micro-Workout Breaks',
        category: 'exercise',
        difficulty: 'easy',
        duration: '2-5 minutes',
        description: 'Short bursts of activity throughout the day to boost energy and reduce sedentary time.',
        content: 'Incorporate brief physical activities into your workday to improve circulation and energy levels.',
        benefits: ['Increased energy', 'Better circulation', 'Reduced back pain', 'Improved focus'],
        steps: [
          'Set a timer for every hour',
          'Do 10 squats or lunges',
          'Take a short walk around your office',
          'Do desk stretches',
          'Take the stairs instead of the elevator'
        ],
        tags: ['micro-exercise', 'energy boost', 'workplace wellness'],
        isPersonalized: true
      },
      {
        id: 8,
        title: 'Gratitude Journaling',
        category: 'mental-health',
        difficulty: 'easy',
        duration: '5 minutes',
        description: 'Daily practice of writing down things you\'re grateful for to improve mental well-being.',
        content: 'Regular gratitude practice has been shown to improve mood, reduce stress, and increase overall life satisfaction.',
        benefits: ['Improved mood', 'Reduced stress', 'Better sleep', 'Increased optimism'],
        steps: [
          'Choose a consistent time each day',
          'Write down 3 things you\'re grateful for',
          'Be specific and detailed',
          'Focus on people, experiences, or simple pleasures',
          'Reflect on why you\'re grateful for each item'
        ],
        tags: ['gratitude', 'journaling', 'mental wellness'],
        isPersonalized: true
      }
    ];
    setTips(mockTips);
    setFilteredTips(mockTips);
  }

  function filterTips(category) {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredTips(tips);
    } else {
      setFilteredTips(tips.filter(tip => tip.category === category));
    }
  }

  function getDifficultyColor(difficulty) {
    const colors = {
      'easy': 'var(--success)',
      'medium': 'var(--warning)',
      'hard': 'var(--error)'
    };
    return colors[difficulty] || 'var(--text-muted)';
  }

  function getCategoryIcon(category) {
    const icons = {
      'nutrition': '🥗',
      'exercise': '🏃‍♂️',
      'sleep': '😴',
      'mental-health': '🧘‍♀️',
      'all': '💡'
    };
    return icons[category] || '💡';
  }

  const categories = [
    { value: 'all', label: 'All Tips', icon: '💡' },
    { value: 'nutrition', label: 'Nutrition', icon: '🥗' },
    { value: 'exercise', label: 'Exercise', icon: '🏃‍♂️' },
    { value: 'sleep', label: 'Sleep', icon: '😴' },
    { value: 'mental-health', label: 'Mental Health', icon: '🧘‍♀️' }
  ];

  return (
    <div>
      {/* Header */}
      <div className="card mb-6">
        <div className="card-header">
          <h1 className="card-title">Wellness Tips & Recommendations</h1>
          <p className="text-muted">Personalized health tips based on your goals and preferences</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="card-title">Browse by Category</h3>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => filterTips(category.value)}
              className={selectedCategory === category.value ? 'primary' : 'secondary'}
              style={{ fontSize: '0.875rem' }}
            >
              <span style={{ marginRight: '0.5rem' }}>{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tips Grid */}
      <div className="dashboard-grid">
        {filteredTips.map((tip) => (
          <div key={tip.id} className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">{tip.title}</h3>
              <div className="dashboard-card-icon" style={{ 
                backgroundColor: tip.isPersonalized ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                color: tip.isPersonalized ? 'var(--accent-primary)' : 'var(--text-secondary)'
              }}>
                {getCategoryIcon(tip.category)}
              </div>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <span className={`badge ${tip.difficulty === 'easy' ? 'success' : tip.difficulty === 'medium' ? 'warning' : 'error'}`}>
                  {tip.difficulty}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {tip.duration}
                </span>
                {tip.isPersonalized && (
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: 'var(--accent-primary)', 
                    fontWeight: 600,
                    backgroundColor: 'var(--accent-light)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    ✨ Personalized
                  </span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {tip.description}
              </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: 600 }}>Benefits:</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                {tip.benefits.map((benefit, index) => (
                  <span key={index} style={{ 
                    fontSize: '0.75rem', 
                    backgroundColor: 'var(--bg-tertiary)', 
                    color: 'var(--text-secondary)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    {benefit}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: 600 }}>Steps:</h4>
              <ol style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {tip.steps.slice(0, 3).map((step, index) => (
                  <li key={index} style={{ marginBottom: '0.25rem' }}>{step}</li>
                ))}
                {tip.steps.length > 3 && (
                  <li style={{ fontStyle: 'italic' }}>...and {tip.steps.length - 3} more steps</li>
                )}
              </ol>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '1rem' }}>
              {tip.tags.map((tag, index) => (
                <span key={index} style={{ 
                  fontSize: '0.75rem', 
                  backgroundColor: 'var(--accent-light)', 
                  color: 'var(--accent-primary)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  #{tag}
                </span>
              ))}
            </div>

            <button 
              className="primary"
              style={{ width: '100%', fontSize: '0.875rem' }}
              onClick={() => {
                // In a real app, this would open a detailed view or start the tip
                alert(`Starting: ${tip.title}\n\n${tip.content}`);
              }}
            >
              Start This Tip
            </button>
          </div>
        ))}
      </div>

      {filteredTips.length === 0 && (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-title">No tips found</div>
            <div className="empty-state-description">Try selecting a different category</div>
          </div>
        </div>
      )}

      {/* Personalized Recommendations */}
      <div className="card mt-6">
        <div className="card-header">
          <h2 className="card-title">Personalized for You</h2>
          <p className="text-muted">Tips tailored to your health goals and preferences</p>
        </div>
        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: 'var(--bg-secondary)', 
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--accent-primary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '2rem' }}>✨</div>
            <div>
              <h3 style={{ margin: 0, color: 'var(--accent-primary)' }}>AI-Powered Recommendations</h3>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Based on your health data and goals
              </p>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Our AI analyzes your assessment results, journal entries, and health goals to provide personalized wellness tips. 
            The more you use Khisha Health, the better our recommendations become!
          </p>
        </div>
      </div>
    </div>
  );
}
