import { useEffect, useState } from 'react'
import { api } from '../api'

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [title, setTitle] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [activeId, setActiveId] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    try {
      setLoading(true);
      const res = await api.listConversations();
      setConversations(res.conversations || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
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
    
    // Health advice patterns
    if (message.includes('headache') || message.includes('head pain')) {
      return "I understand you're experiencing a headache. Here are some general suggestions:\n\n• Stay hydrated by drinking plenty of water\n• Rest in a quiet, dark room\n• Apply a cold compress to your forehead\n• Consider over-the-counter pain relief if appropriate\n\nIf your headache is severe, persistent, or accompanied by other symptoms, please consult a healthcare professional immediately.";
    }
    
    if (message.includes('sleep') || message.includes('insomnia') || message.includes('tired')) {
      return "Sleep is crucial for your health! Here are some tips for better sleep:\n\n• Maintain a consistent sleep schedule\n• Create a relaxing bedtime routine\n• Keep your bedroom cool, dark, and quiet\n• Avoid screens 1 hour before bed\n• Limit caffeine and alcohol in the evening\n• Exercise regularly, but not too close to bedtime\n\nIf sleep problems persist, consider consulting a sleep specialist.";
    }
    
    if (message.includes('stress') || message.includes('anxious') || message.includes('anxiety')) {
      return "Managing stress is important for your overall well-being. Try these techniques:\n\n• Practice deep breathing exercises\n• Engage in regular physical activity\n• Try meditation or mindfulness\n• Maintain social connections\n• Get adequate sleep\n• Consider talking to a mental health professional\n\nRemember, it's okay to ask for help when you need it.";
    }
    
    if (message.includes('exercise') || message.includes('workout') || message.includes('fitness')) {
      return "Great question about exercise! Here's some guidance:\n\n• Aim for at least 150 minutes of moderate exercise per week\n• Include both cardio and strength training\n• Start slowly if you're new to exercise\n• Find activities you enjoy\n• Listen to your body and rest when needed\n• Stay hydrated during workouts\n\nAlways consult with a healthcare provider before starting a new exercise program.";
    }
    
    if (message.includes('diet') || message.includes('nutrition') || message.includes('eating')) {
      return "Nutrition plays a key role in your health. Consider these tips:\n\n• Eat a variety of fruits and vegetables\n• Choose whole grains over refined grains\n• Include lean proteins\n• Limit processed foods and added sugars\n• Stay hydrated with water\n• Practice portion control\n• Consider consulting a registered dietitian for personalized advice";
    }
    
    if (message.includes('cold') || message.includes('flu') || message.includes('sick')) {
      return "I hope you feel better soon! Here are some general wellness tips:\n\n• Get plenty of rest\n• Stay hydrated with water, tea, or broth\n• Use a humidifier to ease congestion\n• Gargle with salt water for a sore throat\n• Wash your hands frequently\n• Consider over-the-counter remedies as appropriate\n\nIf symptoms are severe or persist, please consult a healthcare provider.";
    }
    
    if (message.includes('pain') || message.includes('hurt') || message.includes('ache')) {
      return "I'm sorry to hear you're experiencing pain. Here are some general suggestions:\n\n• Rest the affected area\n• Apply ice for acute injuries (first 48 hours)\n• Use heat for chronic pain or muscle stiffness\n• Consider over-the-counter pain relief if appropriate\n• Gentle stretching may help with muscle pain\n\nFor persistent or severe pain, please consult a healthcare professional for proper evaluation and treatment.";
    }
    
    if (message.includes('weight') || message.includes('lose weight') || message.includes('gain weight')) {
      return "Weight management is a personal journey. Here are some general principles:\n\n• Focus on sustainable lifestyle changes\n• Eat a balanced diet with appropriate portions\n• Engage in regular physical activity\n• Get adequate sleep\n• Manage stress effectively\n• Consider working with healthcare professionals\n\nRemember, everyone's body is different. It's best to consult with a healthcare provider or registered dietitian for personalized guidance.";
    }
    
    // Default response for general health questions
    if (message.includes('health') || message.includes('wellness') || message.includes('healthy')) {
      return "I'm here to help with your health and wellness questions! Here are some general health tips:\n\n• Maintain a balanced diet rich in fruits and vegetables\n• Stay physically active with regular exercise\n• Get 7-9 hours of quality sleep each night\n• Manage stress through relaxation techniques\n• Stay hydrated by drinking plenty of water\n• Schedule regular check-ups with your healthcare provider\n\nIs there a specific health topic you'd like to discuss? I can provide more targeted advice!";
    }
    
    // Default response for other messages
    return "Thank you for sharing that with me. I'm here to help with your health and wellness questions. Could you tell me more about what specific health topic you'd like to discuss? I can provide information about nutrition, exercise, sleep, stress management, and general wellness tips.";
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
        
        {/* Conversations List */}
        <div className="flex flex-col gap-2 mb-4">
          {conversations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">💬</div>
              <div className="empty-state-title">No conversations yet</div>
              <div className="empty-state-description">Start a new conversation to get health advice</div>
            </div>
          ) : (
            conversations.map((c) => (
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


