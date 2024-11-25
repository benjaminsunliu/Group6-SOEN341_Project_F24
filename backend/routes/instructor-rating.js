// routes/instructorRoutes.js
const express = require('express');
const { authenticateToken } = require('../middleware/authenticateToken'); // Adjust path as needed
const Team = require('../models/team'); // Adjust path as needed
const Rating = require('../models/rating'); // Adjust path as needed

const router = express.Router();

// API for instructors to get their students' ratings
router.get('/:instructorId/ratings', authenticateToken, async (req, res) => {
  const instructorId = req.params.instructorId; // Use instructorId from the URL

  try {
    // Find all teams where userId matches the instructor's ID
    const teams = await Team.find({ userId: instructorId });

    // Extract all student emails from the teams
    const studentEmails = teams.flatMap(team => team.members);
    const uniqueStudentEmails = [...new Set(studentEmails)]; // Removes duplicate emails

    // Get ratings for each unique student email
    const ratingsPromises = uniqueStudentEmails.map(email =>
      Rating.find({ ratedEmail: email })
    );

    // Wait for all ratings to be fetched
    const ratingsResults = await Promise.all(ratingsPromises);

    // Structure the ratings by each student's email
    const ratingsByStudent = uniqueStudentEmails.reduce((acc, email, index) => {
      acc[email] = ratingsResults[index];
      return acc;
    }, {});

    // Respond with both team and rating information
    res.json({ teams, ratingsByStudent });
  } catch (error) {
    console.error("Error fetching teams and ratings:", error);
    res.status(500).json({ error: 'Error fetching teams and ratings' });
  }
});

module.exports = router;
