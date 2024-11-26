const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authenticateToken');
const Team = require('../models/team'); // Import the Team model if needed

// Get the teams based on role
router.get('/get-teams', authenticateToken, async (req, res) => {
  try {
    let teams;

    if (req.user.role === 'instructor') {
      // Fetch teams where the instructor is the user
      teams = await Team.find({ userId: req.user.userId });
    } else if (req.user.role === 'student') {
      // Fetch teams where the student's email is in the members array
      teams = await Team.find({ members: req.user.email });
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json({ teams });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teams', error });
  }
});

module.exports = router;
