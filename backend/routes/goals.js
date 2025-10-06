const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { HealthGoal } = require('../models');

// GET /api/goals
router.get('/', auth, async (req, res) => {
  try {
    const goals = await HealthGoal.findAll({ 
      where: { userId: req.user.id }, 
      order: [['createdAt', 'DESC']] 
    });
    res.json({ message: 'Health goals retrieved', goals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/goals
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, target, deadline, priority } = req.body;
    if (!title || !target) {
      return res.status(400).json({ error: 'title and target are required' });
    }

    const goal = await HealthGoal.create({
      title,
      description: description || '',
      category: category || 'general',
      target,
      deadline: deadline || null,
      priority: priority || 'medium',
      progress: 0,
      status: 'active',
      userId: req.user.id
    });

    res.status(201).json({ message: 'Health goal created successfully', goal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/goals/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const goal = await HealthGoal.findOne({ where: { id, userId: req.user.id } });
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    // Auto-update status based on progress
    if (updates.progress !== undefined) {
      if (updates.progress >= 100) {
        updates.status = 'completed';
      } else if (updates.progress < 100 && goal.status === 'completed') {
        updates.status = 'active';
      }
    }

    await goal.update(updates);
    res.json({ message: 'Goal updated successfully', goal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/goals/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const goal = await HealthGoal.findOne({ where: { id, userId: req.user.id } });
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    await goal.destroy();
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
