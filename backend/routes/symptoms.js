const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Symptom } = require('../models');

// GET /api/symptoms
router.get('/', auth, async (req, res) => {
  try {
    const { category } = req.query;
    const whereClause = { userId: req.user.id };
    
    if (category && category !== 'all') {
      whereClause.category = category;
    }

    const symptoms = await Symptom.findAll({ 
      where: whereClause,
      order: [['createdAt', 'DESC']] 
    });
    res.json({ message: 'Symptoms retrieved', symptoms });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/symptoms
router.post('/', auth, async (req, res) => {
  try {
    const { name, severity, location, description, triggers, duration, notes, category } = req.body;
    if (!name || !severity) {
      return res.status(400).json({ error: 'name and severity are required' });
    }

    const symptom = await Symptom.create({
      name,
      severity,
      location: location || '',
      description: description || '',
      triggers: triggers || '',
      duration: duration || '',
      notes: notes || '',
      category: category || 'other',
      frequency: 'once',
      userId: req.user.id
    });

    res.status(201).json({ message: 'Symptom added successfully', symptom });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/symptoms/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const symptom = await Symptom.findOne({ where: { id, userId: req.user.id } });
    if (!symptom) {
      return res.status(404).json({ error: 'Symptom not found' });
    }

    await symptom.update(updates);
    res.json({ message: 'Symptom updated successfully', symptom });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/symptoms/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const symptom = await Symptom.findOne({ where: { id, userId: req.user.id } });
    if (!symptom) {
      return res.status(404).json({ error: 'Symptom not found' });
    }

    await symptom.destroy();
    res.json({ message: 'Symptom deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
