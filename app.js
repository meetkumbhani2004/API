const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const authRouter = require('./routes/auth');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Middleware
app.use(session({
  secret: 'my_super_secret_key', // 🔐 Replace with your secure secret
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Set to true if using HTTPS
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// MongoDB Connection
mongoose.connect('mongodb+srv://madapreyeyeu5150_db_user:6A9ahlrczJORG3Ev@cluster0.1zc6ayv.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err.message));

// Routes
app.use('/auth', authRouter);

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
