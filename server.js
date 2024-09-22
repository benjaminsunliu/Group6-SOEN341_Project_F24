const express = require('express');
const path = require('path');
const cors = require('cors'); //Allows interaction between different origins

const app = express();
const port = 5000;

// Use CORS middleware
app.use(cors());

// Serve static files from the 'client/build' directory
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Handle any other routes (optional)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});



//Start the server
app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`);
});