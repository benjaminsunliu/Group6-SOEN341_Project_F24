require('dotenv').config();
const { MongoClient } = require('mongodb');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const uri = "mongodb+srv://login:moon@logincluster.thvtn.mongodb.net/?retryWrites=true&w=majority&appName=LoginCluster";
const client = new MongoClient(uri);

async function SendPasswordRecoveryEmail(email) {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
                //connect to MongoDB

                        //test Database

        const database = client.db('test');

        //collection "users" within "test" DB

        const collection = database.collection('users'); 

        console.log(`Searching for email: ${email}`);
        const user = await collection.findOne({ email: email });
        console.log(`User found: ${user}`);
        if (!user) {
            throw new Error('Email not found');
        }

        // Generate a unique token
        const token = crypto.randomBytes(20).toString('hex');


                //the token expires in 1 min

        const expiration = Date.now() + 60000;

        await collection.updateOne({ email: email }, { $set: { resetPasswordToken: token, resetPasswordExpires: expiration } });

        //email 
        console.log(`Email user: ${process.env.EMAIL_USER}`);
        console.log(`Email pass: ${process.env.EMAIL_PASS ? 'Loaded' : 'Not Loaded'}`);

        //needs to be adjusted

        const transporter = nodemailer.createTransport({
            //domain( needs to be determined, usually school email for student)
            //Concordia host the email(or outlook)
            host: 'concordia.ca', 
            port: 500, 
            secure: false, 
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        //the email to be send to the user

        const mailOptions = {
            to: email,
            //domain (email send from) to the user
            //domain should be concordia
            from: 'passwordreset@domain.com',
            subject: 'Password Reset',
                        //with the text below

            text: `You are receiving this because you or someone else have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            http://domain.com/reset/${token}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        await transporter.sendMail(mailOptions);
        console.log('Password recovery email sent');
    } catch (error) {
        console.error('Error sending password recovery email:', error.message);
    } finally {
        await client.close();
    }
}

module.exports = SendPasswordRecoveryEmail;
