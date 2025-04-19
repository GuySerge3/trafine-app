const ors = require('../utils/ors');

exports.calculateRoute = async (from, to, avoidTolls) => {
  return await ors.getDirections(from, to, avoidTolls);
};
