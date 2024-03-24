const express = require("express");
const router = express.Router();
const multer = require("multer");
const nodemailer = require('nodemailer');
const path = require('path'); // For working with file paths

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Destination folder for storing uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Add timestamp for uniqueness
  }
});

const upload = multer({ storage: storage });

// Create user
router.post("/register", upload.fields([
  { name: 'front_govt_ID', maxCount: 1 },
  { name: 'back_govt_ID', maxCount: 1 }
]), async (req, res, next) => {
  try {
    const { firstname, lastname, email, mobile_no, work_authorization, ssn } = req.body;
console.log(req.files)
    const frontGovtIDPath = req.files['front_govt_ID'] ? req.files['front_govt_ID'][0].path : null;
    const backGovtIDPath = req.files['back_govt_ID'] ? req.files['back_govt_ID'][0].path : null;

    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.PASS  
      }
    });

    // Compose email
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER, 
      subject: 'New User Registration',
      text: `
        First Name: ${firstname}
        Last Name: ${lastname}
        Email: ${email}
        Mobile No: ${mobile_no}
        Work Authorization: ${work_authorization}
        SSN: ${ssn}
      `,
      attachments: [
        {
          filename: 'front_govt_ID.jpg',
          path: frontGovtIDPath
        },
        {
          filename: 'back_govt_ID.jpg',
          path: backGovtIDPath
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
