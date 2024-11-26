const mongoose = require('mongoose'); 
// Student Schema
const studentSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    studentID: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
  });


// Create and export the Student model
module.exports = mongoose.model('Student', studentSchema);
