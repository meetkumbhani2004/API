const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'your_secret_key', // Replace with a secure secret in production
  resave: false,    
  saveUninitialized: false
}));

// ✅ Connect to MongoDB (no deprecated options)
mongoose.connect('mongodb://localhost:27017/loginApp')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ✅ API Routes
app.use('/api', 
    
);


// ✅ Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
