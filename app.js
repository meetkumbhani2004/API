const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'your_secret_key', // 🔐 Use .env in production
  resave: false,
  saveUninitialized: false
}));

// MongoDB Connection
mongoose.connect('mongodb+srv://madapreyeyeu5150_db_user:dr8hF0xfeBt1SwJl@cluster0api.yxhap3k.mongodb.net/')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
