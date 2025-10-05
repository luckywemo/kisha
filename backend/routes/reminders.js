const express = require('express');
const { Reminder } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all reminders for user
router.get('/', auth, async (req, res) => {
  try {
    const reminders = await Reminder.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(reminders);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({ error: 'Failed to fetch reminders' });
  }
});

// Create new reminder
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, type, time, frequency, isActive = true } = req.body;
    
    const reminder = await Reminder.create({
      title,
      description,
      type,
      time,
      frequency,
      isActive,
      userId: req.user.id,
      nextTrigger: calculateNextTrigger(time, frequency)
    });
    
    res.status(201).json(reminder);
  } catch (error) {
    console.error('Error creating reminder:', error);
    res.status(500).json({ error: 'Failed to create reminder' });
  }
});

// Update reminder
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Recalculate next trigger if time or frequency changed
    if (updates.time || updates.frequency) {
      const reminder = await Reminder.findByPk(id);
      if (reminder && reminder.userId === req.user.id) {
        updates.nextTrigger = calculateNextTrigger(
          updates.time || reminder.time, 
          updates.frequency || reminder.frequency
        );
      }
    }
    
    const [updated] = await Reminder.update(updates, {
      where: { id, userId: req.user.id },
      returning: true
    });
    
    if (updated === 0) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    
    const updatedReminder = await Reminder.findByPk(id);
    res.json(updatedReminder);
  } catch (error) {
    console.error('Error updating reminder:', error);
    res.status(500).json({ error: 'Failed to update reminder' });
  }
});

// Delete reminder
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await Reminder.destroy({
      where: { id, userId: req.user.id }
    });
    
    if (deleted === 0) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    
    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    res.status(500).json({ error: 'Failed to delete reminder' });
  }
});

// Mark reminder as completed
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    
    const reminder = await Reminder.findOne({
      where: { id, userId: req.user.id }
    });
    
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    
    const now = new Date();
    const nextTrigger = calculateNextTrigger(reminder.time, reminder.frequency);
    
    await reminder.update({
      lastTriggered: now,
      nextTrigger: nextTrigger,
      completionNotes: notes
    });
    
    res.json(reminder);
  } catch (error) {
    console.error('Error completing reminder:', error);
    res.status(500).json({ error: 'Failed to complete reminder' });
  }
});

// Toggle reminder active status
router.post('/:id/toggle', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const reminder = await Reminder.findOne({
      where: { id, userId: req.user.id }
    });
    
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    
    const newStatus = !reminder.isActive;
    const updates = { isActive: newStatus };
    
    // If activating, calculate next trigger
    if (newStatus) {
      updates.nextTrigger = calculateNextTrigger(reminder.time, reminder.frequency);
    } else {
      updates.nextTrigger = null;
    }
    
    await reminder.update(updates);
    res.json(reminder);
  } catch (error) {
    console.error('Error toggling reminder:', error);
    res.status(500).json({ error: 'Failed to toggle reminder' });
  }
});

// Get reminder statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const reminders = await Reminder.findAll({
      where: { userId: req.user.id }
    });
    
    const activeReminders = reminders.filter(r => r.isActive);
    const overdueReminders = activeReminders.filter(r => {
      if (!r.nextTrigger) return false;
      return new Date(r.nextTrigger) <= new Date();
    });
    
    const completedToday = reminders.filter(r => {
      if (!r.lastTriggered) return false;
      const lastTriggered = new Date(r.lastTriggered);
      const today = new Date();
      return lastTriggered.toDateString() === today.toDateString();
    });
    
    // Calculate success rate (completed vs total active reminders in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentCompletions = reminders.filter(r => {
      if (!r.lastTriggered) return false;
      return new Date(r.lastTriggered) >= sevenDaysAgo;
    });
    
    const successRate = activeReminders.length > 0 
      ? Math.round((recentCompletions.length / (activeReminders.length * 7)) * 100)
      : 0;
    
    res.json({
      total: reminders.length,
      active: activeReminders.length,
      overdue: overdueReminders.length,
      completedToday: completedToday.length,
      successRate: Math.min(successRate, 100)
    });
  } catch (error) {
    console.error('Error fetching reminder stats:', error);
    res.status(500).json({ error: 'Failed to fetch reminder statistics' });
  }
});

// Helper function to calculate next trigger time
function calculateNextTrigger(time, frequency) {
  const now = new Date();
  const [hours, minutes] = time.split(':').map(Number);
  const nextTrigger = new Date();
  nextTrigger.setHours(hours, minutes, 0, 0);

  if (frequency === 'daily') {
    if (nextTrigger <= now) {
      nextTrigger.setDate(nextTrigger.getDate() + 1);
    }
  } else if (frequency === 'weekly') {
    nextTrigger.setDate(nextTrigger.getDate() + 7);
  } else if (frequency === 'monthly') {
    nextTrigger.setMonth(nextTrigger.getMonth() + 1);
  }

  return nextTrigger;
}

module.exports = router;

