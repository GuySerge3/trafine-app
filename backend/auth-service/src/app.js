require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.routes');
const cors = require('cors');

const app = express();
app.use(express.json());

// Autoriser le frontend (port 4000)
app.use(cors({
  origin: 'http://localhost:4000',
  credentials: true
}));

app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Auth Service running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error('MongoDB connection error:', err));
