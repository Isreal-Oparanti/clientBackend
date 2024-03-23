const express = require("express");
const router = express.Router();
const multer = require("multer");
const nodemailer = require('nodemailer');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Destination folder for storing uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // Use the original filename
  }
});

const upload = multer({ storage: storage });

// Create user
router.post("/register", upload.array('images', 2), async (req, res, next) => {
  try {
    const { firstname, lastname, email, mobile_no, work_authorization, ssn } = req.body;
    console.log(req.files)
    const front_Govt_ID = req.files[0] ? req.files[0].path : '';
    const back_Govt_ID = req.files[1] ? req.files[1].path : '';
         
     
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
