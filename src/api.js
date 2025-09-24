const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error || 'Request failed';
    throw new Error(message);
  }
  return data;
}

export const api = {
  async register({ name, email, password }) {
    return request('/auth/register', { method: 'POST', body: { name, email, password } });
  },
  async login({ email, password }) {
    return request('/auth/login', { method: 'POST', body: { email, password } });
  },
  async getProfile() {
    return request('/users/profile');
  },
  async updateProfile({ name }) {
    return request('/users/profile', { method: 'PUT', body: { name } });
  },
  // Chat
  async listConversations() {
    return request('/chat/conversations');
  },
  async createConversation({ title, initialMessage }) {
    return request('/chat/conversations', { method: 'POST', body: { title, initialMessage } });
  },
  async sendMessage({ conversationId, message, type = 'user' }) {
    return request('/chat/messages', { method: 'POST', body: { conversationId, message, type } });
  },
  async getMessages({ conversationId }) {
    return request(`/chat/conversations/${conversationId}/messages`);
  },
  // Assessment
  async listForms() {
    return request('/assessment/forms');
  },
  async submitAssessment({ formId, responses }) {
    return request('/assessment/submit', { method: 'POST', body: { formId, responses } });
  },
  async getAssessmentResults({ id }) {
    return request(`/assessment/results/${id}`);
  }
};


