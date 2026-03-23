const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Update streak when question is solved
router.post('/update/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found!' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastSolved = user.lastSolvedDate 
      ? new Date(user.lastSolvedDate) 
      : null;

    if (lastSolved) {
      lastSolved.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today - lastSolved) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Already solved today — streak stays same
      } else if (diffDays === 1) {
        // Solved yesterday — increment streak
        user.streak += 1;
        user.lastSolvedDate = today;
      } else {
        // Missed days — reset streak
        user.streak = 1;
        user.lastSolvedDate = today;
      }
    } else {
      // First time solving
      user.streak = 1;
      user.lastSolvedDate = today;
    }

    await user.save();
    res.json({ streak: user.streak });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong!' });
  }
});

// Get user streak
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found!' });
    res.json({ streak: user.streak, lastSolvedDate: user.lastSolvedDate });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong!' });
  }
});

module.exports = router;