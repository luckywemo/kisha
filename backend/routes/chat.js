const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Conversation, Message } = require('../models');

// GET /api/chat/conversations
router.get('/conversations', auth, async (req, res) => {
  try {
    const conversations = await Conversation.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] });
    res.json({ message: 'Conversations retrieved', conversations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/chat/conversations
router.post('/conversations', auth, async (req, res) => {
  try {
    const { title, initialMessage } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });
    const conversation = await Conversation.create({ title, userId: req.user.id });
    if (initialMessage) {
      await Message.create({ conversationId: conversation.id, message: initialMessage, type: 'user' });
    }
    res.status(201).json({ message: 'Conversation created', conversation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/chat/messages
router.post('/messages', auth, async (req, res) => {
  try {
    const { conversationId, message, type } = req.body;
    if (!conversationId || !message) return res.status(400).json({ error: 'conversationId and message are required' });
    const conv = await Conversation.findOne({ where: { id: conversationId, userId: req.user.id } });
    if (!conv) return res.status(404).json({ error: 'Conversation not found' });
    const msg = await Message.create({ conversationId, message, type: type === 'system' ? 'system' : 'user' });
    res.status(201).json({ message: 'Message sent', messageData: msg });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
