const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');

// Get user's progress
router.get('/:userId', async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.params.userId });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong!' });
  }
});

// Update progress and notes
router.post('/update', async (req, res) => {
  try {
    const { userId, questionId, status, notes } = req.body;

    let progress = await Progress.findOne({ userId, questionId });

    if (progress) {
      if (status !== undefined) progress.status = status;
      if (notes !== undefined) progress.notes = notes;
      progress.updatedAt = Date.now();
      await progress.save();
    } else {
      progress = new Progress({ userId, questionId, status, notes });
      await progress.save();
    }

    res.json({ message: 'Progress updated!', progress });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong!' });
  }
});

module.exports = router;