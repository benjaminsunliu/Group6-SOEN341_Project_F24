const express = require('express');
const { authenticateToken } = require('../middleware/authenticateToken'); 
const Team = require('../models/team');
const router = express.Router();

// API for students to get their teams and team members
router.get('/team-members', authenticateToken, async (req, res) => {
  try {
    // Fetch teams where the logged-in user is a member
    const teams = await Team.find({ members: req.user.email });
    
    // Collect all team members' emails, removing duplicates
    const members = teams.flatMap(team => team.members); // Combine all team member emails into one array
    const uniqueMembers = [...new Set(members)]; // Remove duplicate emails
    
    // Respond with the list of unique members
    res.status(200).json({ members: uniqueMembers });
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({ message: 'Error fetching team members', error });
  }
});

module.exports = router;
