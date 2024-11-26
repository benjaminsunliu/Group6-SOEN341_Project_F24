const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const jwtSecret = 'your_jwt_secret';

const router = express.Router();

// User login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ 
      userId: user._id, 
      role: user.role, 
      fName: user.fName, 
      lName: user.lName, 
      email: user.email 
    }, jwtSecret, { expiresIn: '1h' });

    // Set cookie options
    const cookieOptions = {
      httpOnly: false,
      secure: false, // Change to true in production for HTTPS
      maxAge: 3600000, // 1 hour
    };

    // Set the cookie
    res.cookie('token', token, cookieOptions);

    // Return a success message
    res.status(200).json({ message: 'Login successful!', role: user.role, token: token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// User logout route
router.post('/logout', (req, res) => {
    // Clear the cookie that contains the JWT token
    res.clearCookie('token', {
      httpOnly: false,
      secure: false,
    });
    
    res.status(200).json({ message: 'Logout successful!' });
  });

module.exports = router;
