const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');

// Get all experiences
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find()
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong!' });
  }
});

// Add new experience
router.post('/', async (req, res) => {
  try {
    const { userId, company, role, difficulty, result, description } = req.body;
    const experience = new Experience({ 
      userId, company, role, difficulty, result, description 
    });
    await experience.save();
    res.status(201).json({ message: 'Experience added!', experience });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong!' });
  }
});

// Get experiences by company
router.get('/company/:company', async (req, res) => {
  try {
    const experiences = await Experience.find({ company: req.params.company })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong!' });
  }
});

module.exports = router;