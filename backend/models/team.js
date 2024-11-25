const mongoose = require('mongoose');

// Define the Team schema
const teamSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Team name
  userId: { type: String, required: true }, // Instructor's email (or ID if you decide to use ObjectId later)
  members: [{ type: String, required: true }], // List of team members' emails
});

// Create and export the Team model
module.exports = mongoose.model('Team', teamSchema);
