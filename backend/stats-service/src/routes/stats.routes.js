const express = require('express');
const router = express.Router();
const RouteStat = require('../models/routeStat.model');
const IncidentStat = require('../models/incidentStat.model');
const { getTopRoutes } = require('../analytics/routeStats');
const { getIncidentsByType } = require('../analytics/incidentStats');


router.post('/track/route', async (req, res) => {
  try {
    const route = await RouteStat.create(req.body);
    res.status(201).json(route);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.post('/track/incident', async (req, res) => {
  try {
    const incident = await IncidentStat.create(req.body);
    res.status(201).json(incident);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get('/top-routes', async (req, res) => {
  const routes = await getTopRoutes();
  res.json(routes);
});

router.get('/routes', async (req, res) => {
  try {
    const routes = await RouteStat.find().sort({ createdAt: -1 }).limit(20);
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/incidents-by-type', async (req, res) => {
  const data = await getIncidentsByType();
  res.json(data);
});


router.get('/summary/realtime', async (req, res) => {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  
      const incidentsLastHour = await IncidentStat.countDocuments({ createdAt: { $gte: oneHourAgo } });
      const routesLastHour = await RouteStat.countDocuments({ createdAt: { $gte: oneHourAgo } });
  
      res.json({
        timestamp: now,
        incidents_last_hour: incidentsLastHour,
        routes_last_hour: routesLastHour
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/predictions', async (req, res) => {
    try {
      const hours = Array.from({ length: 24 }, (_, i) => i);
      const predictions = [];
  
      for (const hour of hours) {
        const start = new Date();
        start.setHours(hour, 0, 0, 0);
        const end = new Date();
        end.setHours(hour + 1, 0, 0, 0);
  
        const count = await IncidentStat.countDocuments({
          createdAt: { $gte: start, $lt: end }
        });
  
        predictions.push({ hour, incidents: count });
      }
  
      
      const peakHours = predictions.filter(p => p.incidents >= 10);
  
      res.json({
        predictions,
        peakHours
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

module.exports = router;
