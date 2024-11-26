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
const nodemailer = require('nodemailer');
const crypto = require('crypto'); 


// Initialize express app
const app = express();
const port = 5050;
app.use(express.json());

// Use global middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true, // Enable cookies to be sent with requests
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Connect to MongoDB 
mongoose.connect("mongodb+srv://login:moon@logincluster.thvtn.mongodb.net/?retryWrites=true&w=majority&appName=LoginCluster", {
}).then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));


//TEMPORARY
const { authenticateToken } = require('./middleware/authenticateToken');
const { isInstructor } = require('./middleware/isInstructor');

// Model imports
const User = require('./models/user');
const Team = require('./models/team');
const Student = require('./models/student');
const Rating = require('./models/rating');

// Following are API Paths

// Login API
const authenticationRoutes = require('./routes/authentication');
// Create Account API

const createAccountRoutes = require('./routes/createAccount');

//Create Team API
const createTeamRouter = require('./routes/createTeam');
app.use(createTeamRouter);  // Use the router for team routes

// get-teams api
const getTeamsRoute = require('./routes/get-teams');  // Import the route

// get students api
const getStudentsRoute = require('./routes/students');

//rate studeents api
const ratingTheStudentRoute = require('./routes/ratingTheStudent');

//get rated students api
const ratedStudentsRoute = require('./routes/rated-members');

//students get their teams members api
const teamMemberRoute = require('./routes/team-members');

//students get their ratings api
const ratingRoutes = require('./routes/user-ratings');

//instructors get their student's ratings api
const instructorRoutes = require('./routes/instructor-rating');

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

// For login and log out
app.use('/api', authenticationRoutes);

// For account creation
app.use('/api', createAccountRoutes);

// For instructor create team
app.use('/api', createTeamRouter);

// get teams based on role
app.use('/api', getTeamsRoute);

//get students
app.use('/api', getStudentsRoute);

//student rating feature
app.use('/api', ratingTheStudentRoute);

//get rated students
app.use('/api', ratedStudentsRoute);

//get list of student team members
app.use('/api', teamMemberRoute);

//students get their ratings
app.use('/api', ratingRoutes);

//instructors get their student's ratings

app.use('/api/instructor', instructorRoutes);







//Import groups as CSV file
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
      // Trim whitespace from each field
      const trimmedRow = {
        fname: row.fname ? row.fname.trim() : '',
        lname: row.lname ? row.lname.trim() : '',
        email: row.email ? row.email.trim() : '',
        studentID: row.studentID ? row.studentID.trim() : '',
        phone: row.phone ? row.phone.trim() : ''
      };

      if (trimmedRow.fname && trimmedRow.lname && trimmedRow.email && trimmedRow.studentID && trimmedRow.phone) {
        console.log('Processing row:', trimmedRow); // Log each row
        students.push(trimmedRow);
      } else {
        console.warn('Skipping incomplete row:', trimmedRow); // Log incomplete rows
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

//Export groups as CSV file
//api/export-groups
app.get('/api/export-groups', authenticateToken, isInstructor, async (req, res) => {
  try {

    const teams = await Team.find({ userId: req.user.userId });
    //used the csv-writer
    const csvWriter = createObjectCsvWriter({
      path: 'groups.csv',
      //
      header: [
        { id: 'name', title: 'Group Name' },
        { id: 'members', title: 'Members' },
      ],
    });

    const records = teams.map(team => ({
      name: team.name,
      // Convert array to comma separated IDs
      members: team.members.join(', '), 
    }));

    await csvWriter.writeRecords(records);
    res.download('groups.csv');
  } catch (error) {
    console.error('Error exporting groups:', error);
    res.status(500).json({ message: 'Error exporting groups', error });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
