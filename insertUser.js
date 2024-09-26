const readline = require('readline');

// Import the MongoDB client and the connectToDatabase function
const { client, connectToDatabase } = require('./db');

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function insertUser() {
    // Establish the connection to the database
    await connectToDatabase();

    // Connect to the 'bro_db' database and 'users' collection
    const database = client.db('LoginCluster');
    const usersCollection = database.collection('users');

    // Prompt the user for their information
    rl.question('Enter first name: ', (fname) => {
        rl.question('Enter last name: ', (lname) => {
            rl.question('Enter email: ', (email) => {
                rl.question('Enter role (student/instructor): ', (role) => {
                    rl.question('Enter ID: ', (ID) => {
                        rl.question('Enter password: ', async (password) => {
                            const newUser = {
                                fname,
                                lname,
                                email,
                                role,
                                ID,
                                password 
                            };

                            try {
                                // Insert the new user document into the 'users' collection
                                const result = await usersCollection.insertOne(newUser);
                                console.log(`New user created with the following id: ${result.insertedId}`);
                            } catch (error) {
                                console.error('Error inserting user:', error);
                            } finally {
                                // Close the readline interface
                                rl.close();
                            }
                        });
                    });
                });
            });
        });
    });
}

// Run the insertUser function
insertUser().catch(console.dir);
