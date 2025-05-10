require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const incidentRoutes = require('./routes/incident.routes');

const app = express();
const PORT = process.env.PORT || 3004; // ✅ Défini ici

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
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚨 Incident Service running on http://0.0.0.0:${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB error:', err));
