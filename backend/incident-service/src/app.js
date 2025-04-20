require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const incidentRoutes = require('./routes/incident.routes');

const app = express();

// Middleware pour parser du JSON
app.use(express.json());

// Routes de l'API
app.use('/api/incidents', incidentRoutes);

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(process.env.PORT, () =>
      console.log(`🚨 Incident Service running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error('MongoDB error:', err));
