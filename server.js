const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors'); //Allows interaction between different origins

const app = express();
const port = 5000;

// Use CORS middleware
app.use(cors());

//Body Parser middleware
app.use(bodyParser.json());


// Serve static files from the 'client/build' directory
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Handle any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});


app.post('/api/create-account', (req,res) => {
    const {email, password} = req.body;

    //TODO Enter Database logic here

    res.status(201).json({message: 'Account was created successfully!'});
});



//Start the server
app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`);
});