import axios from "axios";

const API_KEY = "your-api-key-here"; // Remplace par ta clé API d'OpenRouteService ou une autre API

export const getRoute = async (start, end) => {
  const { lat: startLat, lon: startLon } = start;
  const { lat: endLat, lon: endLon } = end;

  try {
    const response = await axios.get(`https://api.openrouteservice.org/v2/directions/driving-car`, {
      params: {
        start: `${startLon},${startLat}`,
        end: `${endLon},${endLat}`,
      },
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors du calcul de l'itinéraire", error);
    return null;
  }
};
