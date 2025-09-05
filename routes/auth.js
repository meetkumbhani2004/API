const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pansheriyadipak210@gmail.com',
    pass: 'ksym nrjt odox cvyv'
  }
});

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

module.exports = router;
