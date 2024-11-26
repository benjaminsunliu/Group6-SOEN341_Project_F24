const express = require('express');
const router = express.Router();
const User = require('../models/user');

// User registration route
router.post('/create-account', async (req, res) => {
  const { fName, lName, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`Account creation failed: ${email} is already in use.`);
      return res.status(409).json({ message: 'Email already in use' });
    }

    const user = new User({ fName, lName, email, password, role });
    await user.save();

    console.log(`Account created successfully for ${email}.`);
    res.status(201).json({ message: 'Account created successfully!' });
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ message: 'Error creating account', error });
  }
});

module.exports = router;
