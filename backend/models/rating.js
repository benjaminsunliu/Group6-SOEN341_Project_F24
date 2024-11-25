const mongoose = require('mongoose');

// Define the Rating schema
const ratingSchema = new mongoose.Schema({
  raterEmail: { type: String, required: true }, // Email of the student giving the rating
  ratedEmail: { type: String, required: true }, // Email of the student being rated
  cooperation: { type: Number, required: true, min: 1, max: 5 }, // Rating for cooperation (1-5 scale)
  conceptualContribution: { type: Number, required: true, min: 1, max: 5 }, // Rating for conceptual contribution (1-5 scale)
  practicalContribution: { type: Number, required: true, min: 1, max: 5 }, // Rating for practical contribution (1-5 scale)
  workEthic: { type: Number, required: true, min: 1, max: 5 }, // Rating for work ethic (1-5 scale)
  comments: { type: String, maxlength: 500 }, // Optional comments (up to 500 characters)
});

// Export the Rating model
module.exports = mongoose.model('Rating', ratingSchema);
