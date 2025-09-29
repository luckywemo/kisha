const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { JournalEntry } = require('../models');

// GET /api/journal
router.get('/', auth, async (req, res) => {
  try {
    const { date } = req.query;
    const whereClause = { userId: req.user.id };
    
    if (date) {
      whereClause.date = date;
    }

    const entries = await JournalEntry.findAll({ 
      where: whereClause,
      order: [['date', 'DESC']] 
    });
    res.json({ message: 'Journal entries retrieved', entries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/journal
router.post('/', auth, async (req, res) => {
  try {
    const { 
      date, 
      mood, 
      energy, 
      sleep, 
      exercise, 
      water, 
      stress, 
      notes, 
      symptoms, 
      activities, 
      meals 
    } = req.body;
    
    if (!date || !mood || !energy || !sleep) {
      return res.status(400).json({ error: 'date, mood, energy, and sleep are required' });
    }

    // Check if entry already exists for this date
    const existingEntry = await JournalEntry.findOne({ 
      where: { userId: req.user.id, date } 
    });
    
    if (existingEntry) {
      return res.status(409).json({ error: 'Journal entry already exists for this date' });
    }

    const entry = await JournalEntry.create({
      date,
      mood,
      energy,
      sleep,
      exercise: exercise || 0,
      water: water || 8,
      stress,
      notes: notes || '',
      symptoms: JSON.stringify(symptoms || []),
      activities: JSON.stringify(activities || []),
      meals: JSON.stringify(meals || []),
      userId: req.user.id
    });

    res.status(201).json({ message: 'Journal entry created successfully', entry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/journal/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const entry = await JournalEntry.findOne({ where: { id, userId: req.user.id } });
    if (!entry) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    // Handle array fields
    if (updates.symptoms) {
      updates.symptoms = JSON.stringify(updates.symptoms);
    }
    if (updates.activities) {
      updates.activities = JSON.stringify(updates.activities);
    }
    if (updates.meals) {
      updates.meals = JSON.stringify(updates.meals);
    }

    await entry.update(updates);
    res.json({ message: 'Journal entry updated successfully', entry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/journal/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const entry = await JournalEntry.findOne({ where: { id, userId: req.user.id } });
    if (!entry) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    await entry.destroy();
    res.json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
