const axios = require("axios");

exports.getDirections = async (from, to, avoidTolls) => {
  try {
    const url = "https://api.openrouteservice.org/v2/directions/driving-car";
    const headers = {
      Authorization: process.env.ORS_API_KEY,
      "Content-Type": "application/json",
    };

    const data = {
      coordinates: [[from.lng, from.lat], [to.lng, to.lat]],
      instructions: true,
      ...(avoidTolls && { avoid_features: ["tollways"] }),
    };

    const response = await axios.post(url, data, { headers });

    const feature = response.data.features[0];
    const segment = feature.properties.segments[0];

    // 📍 Format pour MapView (latitude/longitude)
    const route = feature.geometry.coordinates.map(([lon, lat]) => ({
      latitude: lat,
      longitude: lon,
    }));

    return {
      route, // tracé de la polyline
      steps: segment.steps, // instructions étape par étape
      distance_km: (segment.distance / 1000).toFixed(2),
      duration_min: (segment.duration / 60).toFixed(0),
      incidents: [], // tu peux enrichir ici si tu veux détecter les zones à risque
    };
  } catch (err) {
    console.error("[ORS ERROR]", err.response?.data || err.message);
    throw new Error("Erreur lors de la récupération de l'itinéraire.");
  }
};
