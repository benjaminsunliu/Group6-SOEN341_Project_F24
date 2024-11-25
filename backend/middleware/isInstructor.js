const isInstructor = (req, res, next) => {
    console.log('User object:', req.user);  // Debugging line
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Access denied: Instructor role required' });
    }
    next();
  };

  module.exports = { isInstructor };  

  //Use const isInstructor = require('../middleware/isInstructor'); to use in routes
  