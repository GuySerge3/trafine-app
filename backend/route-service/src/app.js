require('dotenv').config();
const express = require('express');
const routeRoutes = require('./routes/route.routes');

const app = express();
const PORT = process.env.PORT || 3003; // ✅ Port par défaut si non défini dans .env

app.use(express.json());
app.use('/api/routes', routeRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Route Service running on http://0.0.0.0:${PORT}`);
});
