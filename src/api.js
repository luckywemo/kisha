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
  },
  // Goals
  async listGoals() {
    return request('/goals');
  },
  async createGoal({ title, description, category, target, deadline, priority }) {
    return request('/goals', { method: 'POST', body: { title, description, category, target, deadline, priority } });
  },
  async updateGoal({ id, updates }) {
    return request(`/goals/${id}`, { method: 'PUT', body: updates });
  },
  async deleteGoal({ id }) {
    return request(`/goals/${id}`, { method: 'DELETE' });
  },
  // Symptoms
  async listSymptoms({ category } = {}) {
    const params = category ? `?category=${category}` : '';
    return request(`/symptoms${params}`);
  },
  async createSymptom({ name, severity, location, description, triggers, duration, notes, category }) {
    return request('/symptoms', { method: 'POST', body: { name, severity, location, description, triggers, duration, notes, category } });
  },
  async updateSymptom({ id, updates }) {
    return request(`/symptoms/${id}`, { method: 'PUT', body: updates });
  },
  async deleteSymptom({ id }) {
    return request(`/symptoms/${id}`, { method: 'DELETE' });
  },
  // Medications
  async listMedications() {
    return request('/medications');
  },
  async createMedication({ name, dosage, frequency, instructions, startDate, endDate, reminderTimes }) {
    return request('/medications', { method: 'POST', body: { name, dosage, frequency, instructions, startDate, endDate, reminderTimes } });
  },
  async updateMedication({ id, updates }) {
    return request(`/medications/${id}`, { method: 'PUT', body: updates });
  },
  async deleteMedication({ id }) {
    return request(`/medications/${id}`, { method: 'DELETE' });
  },
  async markMedicationTaken({ id, notes }) {
    return request(`/medications/${id}/taken`, { method: 'POST', body: { notes } });
  },
  // Journal
  async listJournalEntries({ date } = {}) {
    const params = date ? `?date=${date}` : '';
    return request(`/journal${params}`);
  },
  async createJournalEntry({ date, mood, energy, sleep, exercise, water, stress, notes, symptoms, activities, meals }) {
    return request('/journal', { method: 'POST', body: { date, mood, energy, sleep, exercise, water, stress, notes, symptoms, activities, meals } });
  },
  async updateJournalEntry({ id, updates }) {
    return request(`/journal/${id}`, { method: 'PUT', body: updates });
  },
  async deleteJournalEntry({ id }) {
    return request(`/journal/${id}`, { method: 'DELETE' });
  },
  // Reminders
  async listReminders() {
    return request('/reminders');
  },
  async createReminder({ title, description, type, time, frequency, isActive = true }) {
    return request('/reminders', { method: 'POST', body: { title, description, type, time, frequency, isActive } });
  },
  async updateReminder({ id, updates }) {
    return request(`/reminders/${id}`, { method: 'PUT', body: updates });
  },
  async deleteReminder({ id }) {
    return request(`/reminders/${id}`, { method: 'DELETE' });
  },
  async completeReminder({ id, notes }) {
    return request(`/reminders/${id}/complete`, { method: 'POST', body: { notes } });
  },
  async toggleReminder({ id }) {
    return request(`/reminders/${id}/toggle`, { method: 'POST' });
  },
  async getReminderStats() {
    return request('/reminders/stats');
  },
  // Reports
  async generateReport({ type, startDate, endDate }) {
    return request(`/reports/${type}`, { method: 'POST', body: { startDate, endDate } });
  },
  async generateComprehensiveReport({ startDate, endDate }) {
    return request('/reports/comprehensive', { method: 'POST', body: { startDate, endDate } });
  },
  async generateWeeklyReport({ endDate }) {
    return request('/reports/weekly', { method: 'POST', body: { endDate } });
  },
  async generateMonthlyReport({ endDate }) {
    return request('/reports/monthly', { method: 'POST', body: { endDate } });
  },
  async generateSleepReport({ endDate }) {
    return request('/reports/sleep', { method: 'POST', body: { endDate } });
  },
  // Export
  async exportData({ format, categories, startDate, endDate }) {
    return request(`/export/${format}`, { method: 'POST', body: { categories, startDate, endDate } });
  },
  async getExportCategories() {
    return request('/export/categories');
  },
  async getPdfData({ startDate, endDate }) {
    return request('/export/pdf-data', { method: 'POST', body: { startDate, endDate } });
  },
  // Challenges
  async listChallenges() {
    return request('/challenges');
  },
  async getMyChallenges() {
    return request('/challenges/my-challenges');
  },
  async joinChallenge({ id }) {
    return request(`/challenges/${id}/join`, { method: 'POST' });
  },
  async updateChallengeProgress({ id, progress, notes }) {
    return request(`/challenges/${id}/progress`, { method: 'PUT', body: { progress, notes } });
  },
  async leaveChallenge({ id }) {
    return request(`/challenges/${id}/leave`, { method: 'DELETE' });
  },
  async getChallengeLeaderboard({ id, limit = 10 }) {
    return request(`/challenges/${id}/leaderboard?limit=${limit}`);
  },
  async getAchievements() {
    return request('/challenges/achievements');
  },
  async getChallengeStats() {
    return request('/challenges/stats');
  },
  async getChallengeCategories() {
    return request('/challenges/categories');
  },
  // Wellness Tips
  async getWellnessTips({ category, limit = 20, offset = 0 } = {}) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (limit) params.append('limit', limit);
    if (offset) params.append('offset', offset);
    return request(`/wellness?${params.toString()}`);
  },
  async getWellnessCategories() {
    return request('/wellness/categories');
  },
  async getPersonalizedRecommendations() {
    return request('/wellness/recommendations');
  },
  async getDailyTip() {
    return request('/wellness/daily/tip');
  },
  async getWellnessTip({ id }) {
    return request(`/wellness/${id}`);
  }
};


