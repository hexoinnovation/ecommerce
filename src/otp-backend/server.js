// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();

// Import the Nodemailer module
import nodemailer from "nodemailer";

// Set up Nodemailer transporter using environment variables
const transporter = nodemailer.createTransport({
  service: "gmail", // Gmail service (you can change this for other services)
  auth: {
    user: process.env.EMAIL_USER, // Your email (loaded from .env)
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// Create the email options
const mailOptions = {
  from: process.env.EMAIL_USER, // Sender's email address
  to: "recipient@example.com", // Recipient's email address
  subject: "Test Email from Nodemailer", // Email subject
  text: "This is a test email sent using Nodemailer and environment variables.", // Plain text body
  // Optionally, you can also use HTML content:
  // html: '<h1>Test Email</h1><p>This is a test email with HTML content.</p>',
};

// Send the email using the transporter
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log("Error occurred:", error); // Handle error
  } else {
    console.log("Email sent successfully:", info.response); // Email sent successfully
  }
});
