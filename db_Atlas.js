//MongoDB
//import MongoDB

const { MongoClient } = require('mongodb');

// Replace the connection string with the one provided by MongoDB Atlas
const uri = "";

const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

module.exports = { connectToDatabase, client };
