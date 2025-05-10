const axios = require("axios");
const polyline = require("@mapbox/polyline"); // Assure-toi d'avoir fait: npm install @mapbox/polyline

exports.getDirections = async (from, to, avoidTolls) => {
  try {
    const url = "https://api.openrouteservice.org/v2/directions/driving-car";
    const headers = {
      Authorization: process.env.ORS_API_KEY,
      "Content-Type": "application/json",
    };

    const data = {
      coordinates: [from, to], // ex: [ [lon, lat], [lon, lat] ]
      instructions: true,
      ...(avoidTolls && { avoid_features: ["tollways"] }),
    };

    console.log("🚀 Appel ORS avec données :", JSON.stringify(data));

    const response = await axios.post(url, data, { headers });

    // ✅ Sécurité renforcée : on vérifie toute la structure
    const routeData = response.data?.routes?.[0];

    if (
      !routeData ||
      !Array.isArray(routeData.segments) ||
      !routeData.segments[0] ||
      typeof routeData.geometry !== "string"
    ) {
      console.error(
        "[ORS ERROR] Réponse ORS invalide ou incomplète :",
        response.data
      );
      throw new Error("ORS n'a pas renvoyé d'itinéraire exploitable.");
    }

    const decoded = polyline.decode(routeData.geometry);

    const route = decoded.map(([lat, lon]) => ({
      latitude: lat,
      longitude: lon,
    }));

    const segment = routeData.segments[0];

    return {
      route,
      steps: segment.steps ?? [],
      distance_km: (segment.distance / 1000).toFixed(2),
      duration_min: (segment.duration / 60).toFixed(0),
      incidents: [], // Tu peux enrichir ici
    };
  } catch (err) {
    console.error("[ORS ERROR]", err.response?.data || err.message);
    throw new Error(
      err.message || "Erreur lors de la récupération de l'itinéraire."
    );
  }
};
