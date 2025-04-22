const { calculateRoute } = require('../services/route.service');
const axios = require('axios');
const { calculateBoundingBox } = require('../utils/bbox');

exports.getRoute = async (req, res) => {
  const { from, to, avoidTolls } = req.body;

  try {
    const result = await calculateRoute(from, to, avoidTolls);
    const routeCoordinates = result.features[0].geometry.coordinates;

    const bbox = calculateBoundingBox(routeCoordinates);

    const incidentResponse = await axios.get('http://incident-service:3004/api/incidents', {
      params: { bbox: bbox.join(',') }
    });

    const incidents = incidentResponse.data;

    if (incidents.length > 0) {
      await axios.post('http://alert-service:3005/api/alerts', {
        message: `⚠️ ${incidents.length} incident(s) détecté(s) sur votre trajet`
      });
    }

    const segment = result.features[0].properties.segments[0];

    // 🔮 Appel au service IA pour prédiction
    const now = new Date();
    const predictionRes = await axios.post('http://ai-service:5000/api/ai/predict-traffic', {
      hour: now.getHours(),
      day: now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(),
      incident_count: incidents.length
    });

    const prediction = predictionRes.data.result;

    // 📊 Envoi aux stats
    await axios.post('http://stats-service:3006/api/stats/track/route', {
      from,
      to,
      duration: Math.round(segment.duration),
      userId: req.user ? req.user.id : 'anonymous'
    });

    // ✅ Réponse enrichie
    res.json({
      distance_km: (segment.distance / 1000).toFixed(2),
      duration_min: (segment.duration / 60).toFixed(2),
      incidents,
      steps: segment.steps.map(step => step.instruction),
      prediction // 🔮 ajout ici
    });

  } catch (err) {
    console.error('[getRoute ERROR]', err.message);
    res.status(500).json({ error: err.message });
  }
};
