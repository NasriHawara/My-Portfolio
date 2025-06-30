// C:\Users\Admin\Desktop\My Portfolio\default1\index.js
// For 1st Generation HTTP Function (Easiest Way)

const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors'); // No extra '=' here!

const app = express();

// --- Middleware Setup ---
// Enable CORS for all origins (for development/testing)
app.use(cors({ origin: true }));
// Parse JSON bodies for POST requests
app.use(bodyParser.json());
// Parse URL-encoded bodies (for traditional form submissions, though JSON is used here)
app.use(bodyParser.urlencoded({ extended: true }));

// Define the POST endpoint within the Express app
app.post('/', async (req, res) => {
    // Secrets are accessed via process.env for 1st Gen when listed in firebase.json
    const SENDER_EMAIL = process.env.GMAIL_EMAIL;
    const APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
    const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL;

    // Log to confirm secrets are loaded (for debugging)
    functions.logger.info('Secrets loaded via process.env (1st Gen):', {
        SENDER_EMAIL: SENDER_EMAIL ? 'SET' : 'NOT_SET',
        RECIPIENT_EMAIL: RECIPIENT_EMAIL ? 'SET' : 'NOT_SET'
    });

    // Basic check if secrets are actually set
    if (!SENDER_EMAIL || !APP_PASSWORD || !RECIPIENT_EMAIL) {
        functions.logger.error('Gmail credentials NOT properly set as secrets or are empty! Check Firebase Secret Manager and firebase.json.');
        return res.status(500).send('Email service not configured. Please contact support.');
    }

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: SENDER_EMAIL,
            pass: APP_PASSWORD,
        },
    });

    // Extract form data from request body
    const { name, email, projectType, budget, timeline, message } = req.body;

    // Basic validation for required fields
    if (!name || !email || !message) {
        functions.logger.warn('Missing required form fields in request body:', { name, email, message });
        return res.status(400).send('Required form fields (Name, Email, Project Details) are missing.');
    }

    // Construct email options
    const mailOptions = {
        from: `"${name}" <${SENDER_EMAIL}>`,
        to: RECIPIENT_EMAIL,
        subject: `New Project Inquiry from ${name}`,
        html: `
            <p>You have received a new project inquiry from your portfolio contact form:</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Project Type:</strong> ${projectType || 'Not provided'}</p>
            <p><strong>Approx. Budget:</strong> ${budget ? '$' + budget : 'Not provided'}</p>
            <p><strong>Desired Timeline:</strong> ${timeline || 'Not provided'}</p>
            <p><strong>Project Details:</strong><br>${message}</p>
        `,
        replyTo: email,
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        functions.logger.info('Email sent successfully!');
        res.status(200).send('Email sent successfully!');
    } catch (error) {
        // Log detailed error and send a generic message back to the client
        functions.logger.error('Error sending email (during sendMail):', error);
        res.status(500).send('Error sending email. Please try again later.');
    }
});

// Expose the Express app as a single 1st Gen HTTP Cloud Function
exports.sendContactEmail = functions.https.onRequest(app);