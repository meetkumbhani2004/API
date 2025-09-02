const serverless = require('serverless-http');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const authRoutes = require('../../routes/auth');
require('dotenv').config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api', authRoutes);

module.exports.handler = serverless(app);