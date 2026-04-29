const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const messagesRoute = require('./routes/messages');
const correctRoute  = require('./routes/correct');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',   // Vite dev server
    'http://localhost:3000',   // Docker / production
  ]
}));
app.use(express.json());

// Routes
app.use('/api/messages', messagesRoute);
app.use('/api/correct',  correctRoute);

// Health check — GitHub Actions and Jenkins will ping this
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Connect to MongoDB then start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/chatdb';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });