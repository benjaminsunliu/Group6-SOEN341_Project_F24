const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authenticateToken');
const { isInstructor } = require('../middleware/isInstructor');
const Team = require('../models/team');

// Create team route
router.post('/api/create-team', authenticateToken, isInstructor, async (req, res) => {
    const { groupName, groupMembers, userId } = req.body;
  
    try {
      const team = new Team({ name: groupName, userId: userId, members: groupMembers });
      await team.save();
      console.log(`Team created successfully: ${groupName}`);
      res.status(201).json({ message: 'Team created successfully!' });
    } catch (error) {
      console.error('Error creating team:', error);
      res.status(400).json({ message: 'Error creating team', error });
    }
  });

module.exports = router;
