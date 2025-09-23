const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// GET /api/users/profile
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      message: 'User profile retrieved',
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/users/profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }
    req.user.name = name;
    await req.user.save();
    res.json({
      message: 'Profile updated successfully',
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
