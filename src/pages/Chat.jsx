import { useEffect, useState } from 'react'
import { api } from '../api'

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [title, setTitle] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [activeId, setActiveId] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    try {
      setLoading(true);
      const res = await api.listConversations();
      const conversationsList = res.conversations || [];
      setConversations(conversationsList);
      setFilteredConversations(conversationsList);
    } catch (error) {
      console.error('Error loading conversations:', error);
      setConversations([]);
      setFilteredConversations([]);
    } finally {
      setLoading(false);
    }
  }

  function filterConversations(query) {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredConversations(conversations);
      return;
    }
    
    const filtered = conversations.filter(conv => 
      conv.title?.toLowerCase().includes(query.toLowerCase()) ||
      conv.id.toString().includes(query)
    );
    setFilteredConversations(filtered);
  }

  async function createConversation() {
    if (!title.trim()) return;
    
    try {
      const res = await api.createConversation({ title, initialMessage });
      const conv = res.conversation;
      setConversations([conv, ...conversations]);
      setActiveId(conv.id);
      setTitle('');
      setInitialMessage('');
    } catch (error) {
      console.error('Error creating conversation:', error);
      alert('Failed to create conversation. Please try again.');
    }
  }

  async function send() {
    if (!activeId || !message.trim()) return;
    
    setSending(true);
    try {
      // Send user message
      const res = await api.sendMessage({ conversationId: activeId, message });
      setMessages([...messages, res.messageData]);
      setMessage('');

      // Generate AI response
      const aiResponse = generateHealthResponse(message);
      if (aiResponse) {
        // Add a small delay to simulate AI thinking
        setTimeout(async () => {
          try {
            await api.sendMessage({ 
              conversationId: activeId, 
              message: aiResponse, 
              type: 'system' 
            });
            // Refresh messages to show AI response
            const messagesRes = await api.getMessages({ conversationId: activeId });
            setMessages(messagesRes.messages || []);
          } catch (error) {
            console.error('Error sending AI response:', error);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  }

  function generateHealthResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Enhanced health advice patterns with more specific guidance
    if (message.includes('headache') || message.includes('head pain') || message.includes('migraine')) {
      return "I understand you're experiencing a headache. Here's what you can try:\n\n**Immediate Relief:**\n• Stay hydrated - drink a large glass of water\n• Rest in a quiet, dark room\n• Apply a cold compress to your forehead or neck\n• Try gentle neck and shoulder stretches\n\n**Prevention:**\n• Maintain regular meal times\n• Get consistent sleep\n• Manage stress levels\n• Limit caffeine and alcohol\n\n⚠️ **Seek immediate medical attention if:**\n• Sudden, severe headache (worst you've ever had)\n• Headache with fever, neck stiffness, or confusion\n• Headache after head injury\n\nConsider keeping a headache diary to identify triggers.";
    }
    
    if (message.includes('sleep') || message.includes('insomnia') || message.includes('tired') || message.includes('exhausted')) {
      return "Sleep is fundamental to your health! Here's a comprehensive approach:\n\n**Sleep Hygiene:**\n• Go to bed and wake up at the same time daily\n• Create a cool (65-68°F), dark, quiet bedroom\n• Avoid screens 1-2 hours before bed\n• Use your bed only for sleep and intimacy\n\n**Pre-Sleep Routine:**\n• Take a warm bath or shower\n• Practice relaxation techniques (deep breathing, meditation)\n• Read a book or listen to calming music\n• Avoid caffeine after 2 PM\n\n**When You Can't Sleep:**\n• Get up after 20 minutes and do something relaxing\n• Avoid checking the time repeatedly\n• Try the 4-7-8 breathing technique\n\nIf sleep problems persist for weeks, consider consulting a sleep specialist.";
    }
    
    if (message.includes('stress') || message.includes('anxious') || message.includes('anxiety') || message.includes('overwhelmed')) {
      return "Managing stress is crucial for your mental and physical health. Here are evidence-based strategies:\n\n**Immediate Relief:**\n• Practice the 5-4-3-2-1 grounding technique\n• Take 10 slow, deep breaths\n• Go for a 5-minute walk\n• Listen to calming music\n\n**Long-term Strategies:**\n• Regular exercise (even 10 minutes helps)\n• Mindfulness meditation or yoga\n• Maintain social connections\n• Get adequate sleep (7-9 hours)\n• Limit caffeine and alcohol\n\n**Professional Help:**\n• Consider therapy or counseling\n• Practice cognitive-behavioral techniques\n• Talk to your healthcare provider about options\n\nRemember: It's okay to ask for help. Mental health is just as important as physical health.";
    }
    
    if (message.includes('exercise') || message.includes('workout') || message.includes('fitness') || message.includes('gym')) {
      return "Exercise is one of the best things you can do for your health! Here's a balanced approach:\n\n**Weekly Goals:**\n• 150 minutes moderate cardio (brisk walking, swimming)\n• 2-3 strength training sessions\n• Flexibility exercises (stretching, yoga)\n• Balance exercises (especially important as we age)\n\n**Getting Started:**\n• Start with 10-15 minutes daily\n• Choose activities you enjoy\n• Find an exercise buddy for motivation\n• Track your progress\n\n**Safety First:**\n• Consult your doctor before starting\n• Listen to your body\n• Stay hydrated\n• Warm up and cool down\n• Use proper form to prevent injury\n\n**Motivation Tips:**\n• Set SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)\n• Celebrate small victories\n• Mix up your routine to avoid boredom";
    }
    
    if (message.includes('diet') || message.includes('nutrition') || message.includes('eating') || message.includes('food')) {
      return "Nutrition is the foundation of good health! Here's a balanced approach:\n\n**Daily Plate Guidelines:**\n• 50% fruits and vegetables (aim for 5-7 servings)\n• 25% whole grains (brown rice, quinoa, oats)\n• 25% lean protein (fish, poultry, beans, nuts)\n• Include healthy fats (avocado, olive oil, nuts)\n\n**Hydration:**\n• Drink 8-10 glasses of water daily\n• Start your day with water\n• Eat water-rich foods (cucumber, watermelon)\n\n**Mindful Eating:**\n• Eat slowly and without distractions\n• Stop when you're 80% full\n• Plan meals and snacks\n• Read food labels\n\n**Red Flags to Limit:**\n• Added sugars and sweetened beverages\n• Highly processed foods\n• Excessive sodium\n• Trans fats\n\nConsider consulting a registered dietitian for personalized nutrition guidance.";
    }
    
    if (message.includes('cold') || message.includes('flu') || message.includes('sick') || message.includes('illness')) {
      return "I hope you feel better soon! Here's how to support your recovery:\n\n**Rest and Recovery:**\n• Get plenty of sleep (8-10 hours if possible)\n• Take time off from work/school\n• Avoid strenuous activities\n\n**Hydration and Nutrition:**\n• Drink warm fluids (tea, broth, water)\n• Eat light, easily digestible foods\n• Include vitamin C-rich foods (citrus, berries)\n• Consider zinc supplements (consult your doctor)\n\n**Symptom Relief:**\n• Use a humidifier for congestion\n• Gargle with salt water for sore throat\n• Apply warm compresses for sinus pressure\n• Take over-the-counter medications as directed\n\n**Prevention:**\n• Wash hands frequently\n• Avoid touching your face\n• Get annual flu vaccination\n• Maintain a healthy lifestyle\n\n⚠️ **Seek medical attention if:**\n• Symptoms worsen or persist beyond 10 days\n• High fever (over 101.3°F)\n• Difficulty breathing\n• Severe dehydration";
    }
    
    if (message.includes('pain') || message.includes('hurt') || message.includes('ache') || message.includes('sore')) {
      return "Pain management is important for your quality of life. Here's a comprehensive approach:\n\n**Acute Pain (Recent injury):**\n• RICE method: Rest, Ice, Compression, Elevation\n• Apply ice for 15-20 minutes every 2-3 hours\n• Use over-the-counter pain relievers as directed\n• Gentle movement to prevent stiffness\n\n**Chronic Pain:**\n• Apply heat for muscle stiffness\n• Try gentle stretching and movement\n• Practice relaxation techniques\n• Consider physical therapy\n\n**Pain Tracking:**\n• Keep a pain diary (intensity, triggers, relief methods)\n• Rate pain on a scale of 1-10\n• Note what activities make it better or worse\n\n**Professional Help:**\n• Consult your healthcare provider for persistent pain\n• Consider pain management specialists\n• Physical therapy can be very effective\n\n⚠️ **Emergency situations:**\n• Severe, sudden pain\n• Pain with numbness or weakness\n• Chest pain or difficulty breathing\n• Pain after a fall or injury";
    }
    
    if (message.includes('weight') || message.includes('lose weight') || message.includes('gain weight') || message.includes('dieting')) {
      return "Weight management is about sustainable lifestyle changes. Here's a healthy approach:\n\n**Sustainable Weight Loss (if needed):**\n• Aim for 1-2 pounds per week\n• Create a modest calorie deficit (500-750 calories/day)\n• Focus on nutrient-dense foods\n• Include regular physical activity\n\n**Healthy Eating Habits:**\n• Eat regular meals and snacks\n• Practice portion control\n• Include protein with each meal\n• Stay hydrated (sometimes thirst feels like hunger)\n\n**Exercise for Weight Management:**\n• Combine cardio and strength training\n• Find activities you enjoy and can maintain\n• Aim for consistency over intensity\n\n**Mental Health:**\n• Focus on health, not just weight\n• Celebrate non-scale victories\n• Be patient with yourself\n• Consider working with professionals\n\n⚠️ **Important:** Everyone's body is different. Consult with healthcare providers or registered dietitians for personalized guidance. Avoid extreme diets or rapid weight loss.";
    }
    
    if (message.includes('mental health') || message.includes('depression') || message.includes('mood') || message.includes('feeling down')) {
      return "Mental health is just as important as physical health. Here's how to support yourself:\n\n**Daily Self-Care:**\n• Maintain a regular sleep schedule\n• Eat regular, balanced meals\n• Get some sunlight and fresh air daily\n• Stay connected with supportive people\n\n**Coping Strategies:**\n• Practice mindfulness or meditation\n• Engage in activities you enjoy\n• Exercise regularly (even a short walk helps)\n• Limit alcohol and avoid drugs\n• Practice gratitude (write down 3 good things daily)\n\n**When to Seek Help:**\n• Feeling hopeless or worthless\n• Loss of interest in activities you used to enjoy\n• Significant changes in sleep or appetite\n• Thoughts of self-harm\n\n**Professional Resources:**\n• Talk to your healthcare provider\n• Consider therapy or counseling\n• Crisis helplines are available 24/7\n\nRemember: Asking for help is a sign of strength, not weakness. You don't have to face mental health challenges alone.";
    }
    
    // Default response for general health questions
    if (message.includes('health') || message.includes('wellness') || message.includes('healthy') || message.includes('advice')) {
      return "I'm here to help with your health and wellness questions! Here are the key pillars of good health:\n\n**The Big 5:**\n🏃‍♂️ **Physical Activity** - 150 minutes of moderate exercise weekly\n🥗 **Nutrition** - Balanced diet with plenty of fruits and vegetables\n😴 **Sleep** - 7-9 hours of quality sleep nightly\n🧘‍♀️ **Stress Management** - Regular relaxation and coping strategies\n💧 **Hydration** - 8-10 glasses of water daily\n\n**Prevention:**\n• Regular health check-ups and screenings\n• Vaccinations up to date\n• Avoid smoking and limit alcohol\n• Practice good hygiene\n• Wear sunscreen and protective gear\n\nWhat specific health topic would you like to explore? I can provide detailed guidance on nutrition, exercise, sleep, stress management, pain relief, mental health, and more!";
    }
    
    // Default response for other messages
    return "Thank you for sharing that with me. I'm your health assistant and I'm here to help with your wellness questions. \n\nI can provide guidance on:\n• 🩺 **Symptoms & Pain Management**\n• 😴 **Sleep & Energy**\n• 🏃‍♂️ **Exercise & Fitness**\n• 🥗 **Nutrition & Weight**\n• 🧘‍♀️ **Stress & Mental Health**\n• 💊 **General Health Tips**\n\nWhat specific health topic would you like to discuss? Feel free to describe your concerns or questions in detail.";
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  useEffect(() => {
    if (!activeId) return;
    
    let cancelled = false;
    api.getMessages({ conversationId: activeId }).then((res) => {
      if (!cancelled) setMessages(res.messages || []);
    }).catch(() => {
      if (!cancelled) setMessages([]);
    });
    
    return () => { cancelled = true; };
  }, [activeId]);

  const activeConversation = conversations.find(c => c.id === activeId);

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center" style={{ minHeight: '200px' }}>
          <div className="loading"></div>
          <span style={{ marginLeft: '1rem' }}>Loading conversations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="card-header">
          <h3 className="card-title">Health Conversations</h3>
          <p className="text-muted">Chat with your health assistant</p>
        </div>
        
        {/* Search Conversations */}
        {conversations.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => filterConversations(e.target.value)}
              style={{ fontSize: '0.875rem' }}
            />
          </div>
        )}
        
        {/* Conversations List */}
        <div className="flex flex-col gap-2 mb-4">
          {filteredConversations.length === 0 && conversations.length > 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <div className="empty-state-title">No conversations found</div>
              <div className="empty-state-description">Try a different search term</div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">💬</div>
              <div className="empty-state-title">No conversations yet</div>
              <div className="empty-state-description">Start a new conversation to get health advice</div>
            </div>
          ) : (
            filteredConversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`${activeId === c.id ? 'primary' : ''}`}
                style={{ 
                  textAlign: 'left', 
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: activeId === c.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  backgroundColor: activeId === c.id ? 'var(--accent-light)' : 'var(--bg-primary)'
                }}
              >
                <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>
                  {c.title || `Conversation ${c.id}`}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(c.createdAt).toLocaleDateString()}
                </div>
              </button>
            ))
          )}
        </div>

        {/* New Conversation Form */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <h4 style={{ marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: 600 }}>
            Start New Conversation
          </h4>
          <div className="flex flex-col gap-2">
            <input
              placeholder="Conversation title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ fontSize: '0.875rem' }}
            />
            <textarea
              placeholder="Initial message (optional)"
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              rows={3}
              style={{ fontSize: '0.875rem', resize: 'vertical' }}
            />
            <button
              onClick={createConversation}
              disabled={!title.trim()}
              className="primary"
              style={{ fontSize: '0.875rem' }}
            >
              Start Conversation
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        {!activeId ? (
          <div className="empty-state">
            <div className="empty-state-icon">💬</div>
            <div className="empty-state-title">Select a conversation</div>
            <div className="empty-state-description">
              Choose a conversation from the sidebar or start a new one
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div style={{ 
              padding: '1.5rem', 
              borderBottom: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.125rem' }}>
                {activeConversation?.title || `Conversation ${activeId}`}
              </h3>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Health Assistant • {messages.length} messages
              </p>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">💭</div>
                  <div className="empty-state-title">No messages yet</div>
                  <div className="empty-state-description">
                    Start the conversation by typing a message below
                  </div>
                </div>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className={`chat-message ${m.type === 'user' ? 'user' : ''}`}>
                    <div className="chat-message-header">
                      <span style={{ fontWeight: 500 }}>
                        {m.type === 'system' ? 'Health Assistant' : 'You'}
                      </span>
                      <span>•</span>
                      <span>{new Date(m.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <div className="chat-message-content">
                      {m.message}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="chat-input-container">
              <form onSubmit={(e) => { e.preventDefault(); send(); }} className="chat-input-form">
                <textarea
                  className="chat-input"
                  placeholder="Ask about your health, symptoms, or wellness..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  rows={1}
                  style={{ resize: 'none' }}
                />
                <button
                  type="submit"
                  className="chat-send"
                  disabled={sending || !message.trim()}
                >
                  {sending ? (
                    <>
                      <span className="loading"></span>
                      Sending...
                    </>
                  ) : (
                    'Send'
                  )}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


