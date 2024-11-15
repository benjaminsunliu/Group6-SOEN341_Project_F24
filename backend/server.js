const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const csv = require('csv-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const nodemailer = require('nodemailer'); // Added for sending email
const crypto = require('crypto'); // Added for generating reset token(reset password link)

// Initialize express app
const app = express();
const port = 5050;

// Use middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Connect to MongoDB
mongoose.connect("mongodb+srv://login:moon@logincluster.thvtn.mongodb.net/?retryWrites=true&w=majority&appName=LoginCluster", {
}).then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

// JWT secret
const jwtSecret = 'your_jwt_secret';

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'your_email@gmail.com', // Replace with your email
    pass: 'your_email_password' // Replace with your email password or app password
  }
});

// User schema with roles and reset token fields
const userSchema = new mongoose.Schema({
  fName: { type: String, required: true },
  lName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'instructor'], required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

const User = mongoose.model('User', userSchema);

// Team, Student, and Rating schemas (existing)
const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true },
  members: [{ type: String, required: true }],
});

const studentSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  studentID: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
});

const ratingSchema = new mongoose.Schema({
  raterEmail: { type: String, required: true },
  ratedEmail: { type: String, required: true },
  cooperation: { type: Number, required: true, min: 1, max: 5 },
  conceptualContribution: { type: Number, required: true, min: 1, max: 5 },
  practicalContribution: { type: Number, required: true, min: 1, max: 5 },
  workEthic: { type: Number, required: true, min: 1, max: 5 },
  comments: { type: String, maxlength: 500 },
});

const Team = mongoose.model('Team', teamSchema);
const Student = mongoose.model('Student', studentSchema);
const Rating = mongoose.model('Rating', ratingSchema);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});


// Middleware for JWT authentication
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Middleware to restrict access to instructors only
const isInstructor = (req, res, next) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).json({ message: 'Access denied: Instructor role required' });
  }
  next();
};

// Password Reset Request
app.post('/api/request-reset-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const mailOptions = {
      to: user.email,
      from: 'your_real_email@gmail.com',
      subject: 'Password Reset Request',
      text: `Click the link to reset your password: ${resetUrl}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        return res.status(500).json({ message: 'Error sending password reset email!' });
      }
      
      // Log the response if email is sent successfully
      console.log('Password reset email sent:', info.response);
      res.json({ message: 'Password reset link sent!' });
    });
  } catch (error) {
    console.error('Error in password reset request:', error);
    res.status(500).json({ message: 'Error in password reset request', error });
  }
});



// Reset Password using Token
app.post('/api/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password', error });
  }
});


// User login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role, fName: user.fName, lName: user.lName, email: user.email }, jwtSecret, { expiresIn: '1h' });
    const cookieOptions = { httpOnly: false, secure: false, maxAge: 3600000 };

    res.cookie('token', token, cookieOptions);
    res.status(200).json({ message: 'Login successful!', role: user.role, token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// User logout
app.post('/api/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: false, secure: false });
  res.status(200).json({ message: 'Logout successful!' });
});

// User registration
app.post('/api/create-account', async (req, res) => {
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

// Instructor route to create teams
app.post('/api/create-team', authenticateToken, isInstructor, async (req, res) => {
  const { groupName, groupMembers, userId } = req.body;

  try {
    const team = new Team({ name: groupName, userId, members: groupMembers });
    await team.save();
    console.log(`Team created successfully: ${groupName}`);
    res.status(201).json({ message: 'Team created successfully!' });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(400).json({ message: 'Error creating team', error });
  }
});

// Get the teams based on role
app.get('/api/get-teams', authenticateToken, async (req, res) => {
  try {
    let teams;

    if (req.user.role === 'instructor') {
      teams = await Team.find({ userId: req.user.userId });
    } else if (req.user.role === 'student') {
      teams = await Team.find({ members: req.user.email });
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json({ teams });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teams', error });
  }
});

// Import groups as CSV file
app.post('/api/import-roster', authenticateToken, isInstructor, upload.single('file'), (req, res) => {
  const students = [];

  fs.createReadStream(req.file.path)
    .pipe(csv({
      mapHeaders: ({ header }) => {
        switch (header) {
          case 'fname': return 'fname';
          case 'lname': return 'lname';
          case 'email': return 'email';
          case 'studentID': return 'studentID';
          case 'phone': return 'phone';
          default: return header;
        }
      },
      skipLinesWithError: true,
      skipEmptyLines: true
    }))
    .on('data', (row) => {
      const trimmedRow = {
        fname: row.fname ? row.fname.trim() : '',
        lname: row.lname ? row.lname.trim() : '',
        email: row.email ? row.email.trim() : '',
        studentID: row.studentID ? row.studentID.trim() : '',
        phone: row.phone ? row.phone.trim() : ''
      };

      if (trimmedRow.fname && trimmedRow.lname && trimmedRow.email && trimmedRow.studentID && trimmedRow.phone) {
        console.log('Processing row:', trimmedRow);
        students.push(trimmedRow);
      } else {
        console.warn('Skipping incomplete row:', trimmedRow);
      }
    })
    .on('end', async () => {
      try {
        for (const student of students) {
          const existingStudent = await Student.findOne({ studentID: student.studentID });
          if (existingStudent) {
            await Student.updateOne(
              { studentID: student.studentID },
              { $set: student }
            );
          } else {
            const newStudent = new Student(student);
            await newStudent.save();
          }
        }
        res.status(200).json({ message: 'Roster imported successfully and students updated!' });
      } catch (error) {
        console.error('Error updating students:', error);
        res.status(500).json({ message: 'Error updating students', error });
      }
    });
});

// Get all students
app.get('/api/students', authenticateToken, isInstructor, async (req, res) => {
  try {
    const students = await Student.find({});
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students', error });
  }
});

// Export groups as CSV file
app.get('/api/export-groups', authenticateToken, isInstructor, async (req, res) => {
  try {
    const teams = await Team.find({ userId: req.user.userId });
    const csvWriter = createObjectCsvWriter({
      path: 'groups.csv',
      header: [
        { id: 'name', title: 'Group Name' },
        { id: 'members', title: 'Members' },
      ],
    });

    const records = teams.map(team => ({
      name: team.name,
      members: team.members.join(', '),
    }));

    await csvWriter.writeRecords(records);
    res.download('groups.csv');
  } catch (error) {
    console.error('Error exporting groups:', error);
    res.status(500).json({ message: 'Error exporting groups', error });
  }
});

// Instructor Dashboard route
app.post('/api/instructor-dashboard', authenticateToken, isInstructor, async (req, res) => {
  res.status(200).json({ message: 'Welcome, instructor!' });
});

// Rating creation API
app.post('/api/rate', async (req, res) => {
  const { raterEmail, ratedEmail, cooperation, conceptualContribution, practicalContribution, workEthic, comments } = req.body;

  try {
    const alreadyRated = await Rating.findOne({ raterEmail, ratedEmail });
    if (alreadyRated) {
      return res.status(400).json({ message: 'You have already rated this teammate.' });
    }

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

// Endpoint to get rated members for a specific rater
app.get('/api/rated-members/:raterEmail', authenticateToken, async (req, res) => {
  const { raterEmail } = req.params;
  try {
    const ratedMembers = await Rating.find({ raterEmail });
    const ratedEmails = ratedMembers.map(rating => rating.ratedEmail);
    res.json({ ratedEmails });
  } catch (error) {
    console.error("Error fetching rated members:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API for students to get their teams and team members
app.get('/api/team-members', authenticateToken, async (req, res) => {
  try {
    const teams = await Team.find({ members: req.user.email });
    const members = teams.flatMap(team => team.members);
    res.status(200).json({ members: [...new Set(members)] });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team members', error });
  }
});

// API for students to get their ratings based on their email
app.get('/api/user-ratings/:email', authenticateToken, async (req, res) => {
  const { email } = req.params;
  try {
    const ratings = await Rating.find({ ratedEmail: email });
    res.json(ratings);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ message: "Failed to fetch ratings" });
  }
});

// API for instructors to get their students' ratings
app.get('/api/instructor/:_id/ratings', authenticateToken, async (req, res) => {
  const instructorId = req.params._id;

  try {
    const teams = await Team.find({ userId: instructorId });
    const studentEmails = teams.flatMap(team => team.members);
    const uniqueStudentEmails = [...new Set(studentEmails)];

    const ratingsPromises = uniqueStudentEmails.map(email => Rating.find({ ratedEmail: email }));
    const ratingsResults = await Promise.all(ratingsPromises);

    const ratingsByStudent = uniqueStudentEmails.reduce((acc, email, index) => {
      acc[email] = ratingsResults[index];
      return acc;
    }, {});

    res.json({ teams, ratingsByStudent });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching teams and ratings' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

