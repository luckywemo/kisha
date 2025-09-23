import { useEffect, useState } from 'react'
import { api } from '../api'

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [title, setTitle] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [activeId, setActiveId] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.listConversations().then((res) => setConversations(res.conversations || [])).catch(() => setConversations([]));
  }, []);

  async function createConversation() {
    const res = await api.createConversation({ title, initialMessage });
    const conv = res.conversation;
    setConversations([conv, ...conversations]);
    setActiveId(conv.id);
    setTitle('');
    setInitialMessage('');
  }

  async function send() {
    if (!activeId || !message.trim()) return;
    setSending(true);
    try {
      await api.sendMessage({ conversationId: activeId, message });
      setMessage('');
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16, maxWidth: 960, margin: '20px auto' }}>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Conversations</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {conversations.length === 0 ? <div>No conversations</div> : conversations.map((c) => (
            <button key={c.id} onClick={() => setActiveId(c.id)} style={{ textAlign: 'left' }}>
              {c.title || `Conversation ${c.id}`}
            </button>
          ))}
        </div>
        <hr />
        <h4 style={{ marginBottom: 8 }}>New conversation</h4>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ marginBottom: 8 }} />
        <textarea placeholder="Initial message" value={initialMessage} onChange={(e) => setInitialMessage(e.target.value)} style={{ marginBottom: 8 }} />
        <button onClick={createConversation} disabled={!title.trim()}>Create</button>
      </div>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Messages</h3>
        {!activeId ? (
          <div>Select a conversation</div>
        ) : (
          <div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <input placeholder="Type a message" value={message} onChange={(e) => setMessage(e.target.value)} />
              <button onClick={send} disabled={sending || !message.trim()}>{sending ? 'Sending...' : 'Send'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


