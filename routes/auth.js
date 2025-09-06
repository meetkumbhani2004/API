const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pansheriyadipak210@gmail.com',
    pass: 'ksym nrjt odox cvyv' // ⚠️ Consider using environment variables
  }
});

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Username, password, and email are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const user = new User({ username, password, email });
    await user.save();

    await transporter.sendMail({
      from: 'pansheriyadipak210@gmail.com',
      to: email,
      subject: '🎉 Welcome to Our Service!',
      text: `Hello ${username},\n\nWelcome aboard! We're thrilled to have you with us.\n\nThank you for registering and choosing our service. We’re confident you’ll love what we have in store for you!\n\nIf you ever have any questions, feel free to reach out — we’re always here to help.\n\nWishing you a fantastic experience!\n\nBest regards,\nThe Team`
    });

    res.status(201).json({ message: 'User registered successfully and welcome email sent' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Forgot Password Route (Send OTP)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = otp;
    user.resetOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await transporter.sendMail({
      from: 'pansheriyadipak210@gmail.com',
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`
    });

    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Change Password Route (Verify OTP)
router.post('/change-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    const user = await User.findOne({ email });
    
    if (
      !user ||
      String(user.resetOTP) !== String(otp ) ||
      Date.now() > user.resetOTPExpires
    ) {
      return res.status(400).json({ message: 'Invalid OTP or OTP expired' });
    }

    user.password = newPassword;
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;

    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
