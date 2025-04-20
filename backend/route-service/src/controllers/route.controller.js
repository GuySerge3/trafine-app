const { calculateRoute } = require('../services/route.service');
const axios = require('axios');
const { calculateBoundingBox } = require('../utils/bbox');

exports.getRoute = async (req, res) => {
  const { from, to, avoidTolls } = req.body;

  try {
    const result = await calculateRoute(from, to, avoidTolls);
    const routeCoordinates = result.features[0].geometry.coordinates;

    // 1. Calcul de la zone bbox autour de la route
    const bbox = calculateBoundingBox(routeCoordinates);

    // 2. Requête vers incident-service
    const incidentResponse = await axios.get('http://incident-service:3004/api/incidents', {
      params: { bbox: bbox.join(',') }
    });

    const incidents = incidentResponse.data;

    // 3. Si incidents détectés → notifier alert-service
    if (incidents.length > 0) {
      await axios.post('http://alert-service:3005/api/alerts', {
        message: `⚠️ ${incidents.length} incident(s) détecté(s) sur votre trajet`
      });
    }

    // Résumé à renvoyer
    const segment = result.features[0].properties.segments[0];
    res.json({
      distance_km: (segment.distance / 1000).toFixed(2),
      duration_min: (segment.duration / 60).toFixed(2),
      incidents,
      steps: segment.steps.map(step => step.instruction)
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
