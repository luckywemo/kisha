const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Medication } = require('../models');

// GET /api/medications
router.get('/', auth, async (req, res) => {
  try {
    const medications = await Medication.findAll({ 
      where: { userId: req.user.id }, 
      order: [['createdAt', 'DESC']] 
    });
    res.json({ message: 'Medications retrieved', medications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/medications
router.post('/', auth, async (req, res) => {
  try {
    const { name, dosage, frequency, instructions, startDate, endDate, reminderTimes } = req.body;
    if (!name || !dosage || !frequency) {
      return res.status(400).json({ error: 'name, dosage, and frequency are required' });
    }

    const medication = await Medication.create({
      name,
      dosage,
      frequency,
      instructions,
      startDate,
      endDate,
      reminderTimes: JSON.stringify(reminderTimes || []),
      userId: req.user.id
    });

    res.status(201).json({ message: 'Medication added successfully', medication });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/medications/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const medication = await Medication.findOne({ where: { id, userId: req.user.id } });
    
    if (!medication) {
      return res.status(404).json({ error: 'Medication not found' });
    }

    const { name, dosage, frequency, instructions, startDate, endDate, reminderTimes } = req.body;
    
    await medication.update({
      name: name || medication.name,
      dosage: dosage || medication.dosage,
      frequency: frequency || medication.frequency,
      instructions: instructions || medication.instructions,
      startDate: startDate || medication.startDate,
      endDate: endDate || medication.endDate,
      reminderTimes: reminderTimes ? JSON.stringify(reminderTimes) : medication.reminderTimes
    });

    res.json({ message: 'Medication updated successfully', medication });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/medications/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const medication = await Medication.findOne({ where: { id, userId: req.user.id } });
    
    if (!medication) {
      return res.status(404).json({ error: 'Medication not found' });
    }

    await medication.destroy();
    res.json({ message: 'Medication deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/medications/:id/taken
router.post('/:id/taken', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { takenAt, notes } = req.body;
    
    const medication = await Medication.findOne({ where: { id, userId: req.user.id } });
    if (!medication) {
      return res.status(404).json({ error: 'Medication not found' });
    }

    // In a real app, you'd store this in a separate MedicationLog table
    // For now, we'll just return success
    res.json({ 
      message: 'Medication taken recorded', 
      takenAt: takenAt || new Date().toISOString(),
      notes: notes || ''
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
