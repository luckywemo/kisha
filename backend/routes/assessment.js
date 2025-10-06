const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { AssessmentForm, AssessmentSubmission } = require('../models');

// GET /api/assessment/forms
router.get('/forms', auth, async (req, res) => {
  try {
    const forms = await AssessmentForm.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ message: 'Assessment forms retrieved', forms });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/assessment/submit
router.post('/submit', auth, async (req, res) => {
  try {
    const { formId, responses } = req.body;
    if (!formId || !responses) return res.status(400).json({ error: 'formId and responses are required' });
    const form = await AssessmentForm.findByPk(formId);
    if (!form) return res.status(404).json({ error: 'Form not found' });

    // Simple scoring: count non-empty answers * 10
    const score = Object.values(responses).filter((v) => (v ?? '').toString().trim() !== '').length * 10;
    const submission = await AssessmentSubmission.create({ formId, userId: req.user.id, responses, score });
    res.status(201).json({ message: 'Assessment submitted successfully', assessment: submission });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/assessment/results/:id
router.get('/results/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const results = await AssessmentSubmission.findOne({ where: { id, userId: req.user.id }, include: [{ model: AssessmentForm }] });
    if (!results) return res.status(404).json({ error: 'Result not found' });
    res.json({ message: 'Assessment results retrieved', results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
