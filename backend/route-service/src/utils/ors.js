const axios = require('axios');

exports.getDirections = async (from, to, avoidTolls) => {
  const url = 'https://api.openrouteservice.org/v2/directions/driving-car';
  const headers = {
    Authorization: process.env.ORS_API_KEY,
    'Content-Type': 'application/json'
  };

  const data = {
    coordinates: [[from.lng, from.lat], [to.lng, to.lat]],
    ...(avoidTolls && { avoid_features: ['tollways'] })
  };

  const response = await axios.post(url, data, { headers });
  return response.data;
};
