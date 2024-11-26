const express = require('express');
const Rating = require('../models/rating'); 
const router = express.Router();

router.post('/rate', async (req, res) => {
  const { raterEmail, ratedEmail, cooperation, conceptualContribution, practicalContribution, workEthic, comments } = req.body;

  try {
    // Check if the rater has already rated this teammate
    const alreadyRated = await Rating.findOne({ raterEmail, ratedEmail });
    
    if (alreadyRated) {
      return res.status(400).json({ message: 'You have already rated this teammate.' });
    }

    // Save the rating
    const newRating = new Rating({
      raterEmail,
      ratedEmail,
      cooperation,
      conceptualContribution,
      practicalContribution,
      workEthic,
      comments,
    });

    await newRating.save();
    res.json({ message: 'Rating submitted successfully!' });
  } catch (error) {
    console.error("Error submitting rating:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
