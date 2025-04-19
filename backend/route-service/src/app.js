require('dotenv').config();
const express = require('express');
const routeRoutes = require('./routes/route.routes');

const app = express();
app.use(express.json());
app.use('/api/routes', routeRoutes);

app.listen(process.env.PORT, () =>
  console.log(`🚀 Route Service running on port ${process.env.PORT}`)
);
