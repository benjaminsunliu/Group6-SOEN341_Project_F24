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

// Initialize express app
const app = express();
const port = 5050;

// Use middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your frontend origin
  credentials: true, // Enable cookies to be sent with requests
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

// User schema with roles (student or instructor)
const userSchema = new mongoose.Schema({
  fName: { type: String, required: true },
  lName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'instructor'], required: true }
});

// Password hashing middleware
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const database = mongoose.connection;

const usersCollection = database.collection('users');
const teamsCollection = database.collection('teams');

const User = mongoose.model('User', userSchema);

// Team schema
const teamSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Team name
  userId: { type: String, required: true }, // Instructor's email
  members: [{ type: String, required: true }], // List of team members' emails
});

const Team = mongoose.model('Team', teamSchema);

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;  // Access token from the cookie
  if (!token) return res.sendStatus(401); // No token, unauthorized

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Middleware to ensure only instructors can access certain routes
const isInstructor = (req, res, next) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).json({ message: 'Access denied: Instructor role required' });
  }
  next();
};

// User login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id, role: user.role, fName: user.fName, lName: user.lName, email: user.email}, jwtSecret, { expiresIn: '1h' });

    // Set cookie options
    const cookieOptions = {
      httpOnly: false,
      secure: false, 
      maxAge: 3600000, // 1 hour
    };

    // Set the cookie
    res.cookie('token', token, cookieOptions);

    // Return a success message
    res.status(200).json({ message: 'Login successful!', role: user.role,token: token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// User logout route
app.post('/api/logout', (req, res) => {
  // Clear the cookie that contains the JWT token
  res.clearCookie('token', {
    httpOnly: false,
    secure: false,
  });
  
  res.status(200).json({ message: 'Logout successful!' });
});


// User registration route
app.post('/api/create-account', async (req, res) => {
  const {fName, lName, email, password, role} = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`Account creation failed: ${email} is already in use.`);
      return res.status(409).json({ message: 'Email already in use' });
    }

    const user = new User({fName, lName, email, password, role});
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
  const { groupName, groupMembers, userId} = req.body;

  try {
    const team = new Team({name: groupName, userId: userId, members: groupMembers});
    await team.save();
    console.log(`Team created successfully: ${groupName}`);
    res.status(201).json({ message: 'Team created successfully!' });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(400).json({ message: 'Error creating team', error });
  }
});

app.get('/api/get-teams', authenticateToken, async (req, res) => {
  try {
    let studentTeams = [];
    let otherTeams = [];

    if (req.user.role === 'student') {
      // Fetch teams where the student's email is in the members array
      studentTeams = await Team.find({ members: req.user.email }); // Teams student is in
      
      // Fetch all teams excluding those the student is in
      otherTeams = await Team.find({ members: { $ne: req.user.email } }); // All other teams
    } else if (req.user.role === 'instructor') {
      // Fetch teams associated with the instructor
      studentTeams = await Team.find({ userId: req.user.userId }); // Teams created by instructor
      otherTeams = await Team.find(); // Optionally, fetch all teams for instructor
      
      // You can filter out teams that the instructor is already a part of if needed:
      // otherTeams = await Team.find({ _id: { $nin: studentTeams.map(team => team._id) } });
    } else {
      return res.status(403).json({ message: 'Forbidden: Invalid role' });
    }

    res.status(200).json({ studentTeams, otherTeams });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teams', error });
  }
});




// Route for instructors to import students from CSV and create a team
app.post('/api/import-roster', authenticateToken, isInstructor, (req, res) => {
  const { teamName } = req.body;
  const instructorId = req.user.userId;
  const students = [];

  fs.createReadStream('path/roster.csv')
    .pipe(csv())
    .on('data', (row) => {
      students.push(row.email);  // Assuming CSV contains an 'email' field
    })
    .on('end', async () => {
      try {
        // Find or create users for each student email
        const studentDocs = await Promise.all(
          students.map(async (email) => {
            let student = await User.findOne({ email });
            if (!student) {
              student = new User({ email, password: 'defaultpassword', role: 'student' });
              await student.save();
            }
            return student._id;
          })
        );

        // Create the team
        const team = new Team({ name: teamName, instructor: instructorId, students: studentDocs });
        await team.save();

        res.status(200).json({ message: 'Roster imported successfully and team created!', team });
      } catch (error) {
        res.status(500).json({ message: 'Error importing roster', error });
      }
    });
});

// Students can view their teams
app.get('/api/my-teams', authenticateToken, async (req, res) => {
  try {
    const teams = await Team.find({ students: req.user.userId }).populate('students instructor');
    res.status(200).json({ teams });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teams', error });
  }
});

// Instructors can view teams they created
app.get('/api/instructor-teams', authenticateToken, isInstructor, async (req, res) => {
  try {
    const teams = await Team.find({ instructor: req.user.userId }).populate('students');
    res.status(200).json({ teams });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teams', error });
  }
});


//Export groups as CSV file
//need 'csv-writer'
const { createObjectCsvWriter } = require('csv-writer');
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



//Instructor Dashboard route

app.post('/api/instructor-dashboard', authenticateToken, isInstructor, async (req, res) => {
  res.status(200).json({ message: 'Welcome, instructor!' });
});
// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
