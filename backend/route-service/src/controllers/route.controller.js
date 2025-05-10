const { calculateRoute } = require("../services/route.service");
const axios = require("axios");
const { calculateBoundingBox } = require("../utils/bbox");

exports.getRoute = async (req, res) => {
  const { from, to, avoidTolls } = req.body;
  console.log("📥 Requête reçue du frontend :", { from, to, avoidTolls });

  try {
    const result = await calculateRoute(from, to, avoidTolls);

    const bbox = calculateBoundingBox(
      result.route.map(({ latitude, longitude }) => [longitude, latitude])
    );

    const incidentResponse = await axios.get(
      "http://192.168.1.48:3004/api/incidents",
      {
        params: { bbox: bbox.join(",") },
      }
    );

    const incidents = incidentResponse.data;

    if (incidents.length > 0) {
      await axios.post("http://192.168.1.48:3005/api/alerts", {
        message: `⚠️ ${incidents.length} incident(s) détecté(s) sur votre trajet`,
      });
    }

    // 🔮 Appel au service IA pour prédiction — désactivé temporairement
    let prediction = "indisponible";
    try {
      const now = new Date();
      const predictionRes = await axios.post(
        "http://192.168.1.48:5000/api/ai/predict-traffic",
        {
          hour: now.getHours(),
          day: now
            .toLocaleDateString("en-US", { weekday: "long" })
            .toLowerCase(),
          incident_count: incidents.length,
        }
      );
      prediction = predictionRes.data.result;
    } catch (iaError) {
      console.warn("⚠️ Service IA indisponible :", iaError.message);
    }

    // 📊 Envoi aux stats
    await axios.post("http://192.168.1.48:3006/api/stats/track/route", {
      from,
      to,
      duration: Math.round(result.duration_min * 60),
      userId: req.user ? req.user.id : "anonymous",
    });

    const responsePayload = {
      route: result.route,
      distance_km: result.distance_km,
      duration_min: result.duration_min,
      incidents,
      steps: result.steps.map((step) => step.instruction),
      prediction,
    };

    console.log("📤 Réponse finale envoyée au frontend :", responsePayload);
    res.json(responsePayload);
  } catch (err) {
    console.error("[getRoute ERROR]", err.message);
    res.status(500).json({ error: err.message });
  }
};
