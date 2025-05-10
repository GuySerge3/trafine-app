require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const statsRoutes = require('./routes/stats.routes');

const app = express();
const PORT = process.env.PORT || 3006; // ✅ Port par défaut

app.use(cors());
app.use(express.json());
app.use('/api/stats', statsRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, '0.0.0.0', () =>
      console.log(`📊 Stats Service running on http://0.0.0.0:${PORT}`)
    );
  })
  .catch(err => console.error('MongoDB error:', err));
