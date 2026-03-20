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

// Update progress
router.post('/update', async (req, res) => {
  try {
    const { userId, questionId, status } = req.body;

    // Find existing or create new
    let progress = await Progress.findOne({ userId, questionId });

    if (progress) {
      progress.status = status;
      progress.updatedAt = Date.now();
      await progress.save();
    } else {
      progress = new Progress({ userId, questionId, status });
      await progress.save();
    }

    res.json({ message: 'Progress updated!', progress });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong!' });
  }
});

module.exports = router;