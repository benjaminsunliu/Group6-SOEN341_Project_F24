const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authenticateToken');
const { isInstructor } = require('../middleware/isInstructor');
const Student = require('../models/student'); // Import the Student model

// Get all students (only accessible by instructors)
router.get('/students', authenticateToken, isInstructor, async (req, res) => {
  try {
    const students = await Student.find({});
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students', error });
  }
});

module.exports = router;
