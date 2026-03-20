const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// Get all questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong!' });
  }
});

// Get questions by topic
router.get('/topic/:topic', async (req, res) => {
  try {
    const questions = await Question.find({ topic: req.params.topic });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong!' });
  }
});

module.exports = router;