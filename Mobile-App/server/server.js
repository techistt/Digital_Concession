require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const applicationRoutes = require('./routes/applicationRoutes');

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Digital Bus Concession API is running.',
  });
});

// Application routes
app.use('/api/applications', applicationRoutes);

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully.');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:');
    console.error(error.message);
    process.exit(1);
  });
