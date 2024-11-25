const express = require('express');
const Rating = require('../models/rating'); 
const { authenticateToken } = require('../middleware/authenticateToken'); // Assuming you have an authentication middleware
const router = express.Router();

// Endpoint to get rated members for a specific rater
router.get('/rated-members/:raterEmail', authenticateToken, async (req, res) => {
  const { raterEmail } = req.params;
  
  try {
    // Find ratings where raterEmail matches the provided raterEmail
    const ratedMembers = await Rating.find({ raterEmail });
    
    // Extract the ratedEmail from each rating and return it as an array
    const ratedEmails = ratedMembers.map(rating => rating.ratedEmail);
    
    // Send the response with the rated members
    res.json({ ratedEmails });
  } catch (error) {
    console.error("Error fetching rated members:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
