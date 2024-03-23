const express = require("express");
const router = express.Router();
 
const nodemailer = require('nodemailer');

// Multer configuration
 

// Create user
router.post("/register", async (req, res, next) => {
  try {
    const { firstname, lastname, email, mobile_no,  ssn, work_authorization, front_Govt_ID, back_Govt_ID } = req.body;
      
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.PASS  
      }
    });

    // Compose email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email, 
      subject: 'New User Registration',
      text: `
        First Name: ${firstname}
        Last Name: ${lastname}
        Email: ${email}
        Mobile No: ${mobile_no}
        Work Authorization: ${work_authorization}
        SSN: ${ssn}
      `,
      attachments:  [
        {
          filename: 'front_Govt_ID.jpg',
          path: front_Govt_ID
        },
        {
          filename: 'back_Govt_ID.jpg',
          path: back_Govt_ID
        }
      ]
    };

 
    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully. Confirmation email sent.'
    });

  } catch (error) {
    next(error); // Pass errors to error-handling middleware
  }
});

module.exports = router;
