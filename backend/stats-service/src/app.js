require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const statsRoutes = require('./routes/stats.routes');

const app = express();
app.use(express.json());
app.use('/api/stats', statsRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(process.env.PORT, () =>
      console.log(`📊 Stats Service running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error('MongoDB error:', err));
