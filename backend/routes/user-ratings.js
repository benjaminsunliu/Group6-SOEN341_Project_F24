// routes/ratingRoutes.js
const express = require('express');
const { authenticateToken } = require('../middleware/authenticateToken'); // Adjust path as needed
const Rating = require('../models/rating'); // Adjust path as needed
const router = express.Router();

// API for students to get their ratings based on their email
router.get('/user-ratings/:email', authenticateToken, async (req, res) => {
  const { email } = req.params;
  
  try {
    // Fetch all ratings where the student's email matches the ratedEmail
    const ratings = await Rating.find({ ratedEmail: email });
    
    // Respond with the fetched ratings
    res.json(ratings);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ message: "Failed to fetch ratings" });
  }
});

module.exports = router;
