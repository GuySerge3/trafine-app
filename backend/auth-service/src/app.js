require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.routes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001; // ✅ ici

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:4000',
  credentials: true,
}));

app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Auth Service running on http://0.0.0.0:${PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));
