require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user.routes');

const app = express();
const PORT = process.env.PORT || 3002; // ✅ Port par défaut

app.use(express.json());
app.use('/api/users', userRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ User service connected to MongoDB');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 User Service running on http://0.0.0.0:${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
