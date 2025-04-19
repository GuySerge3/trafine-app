const { calculateRoute } = require('../services/route.service');

exports.getRoute = async (req, res) => {
  const { from, to, avoidTolls } = req.body;
  try {
    const result = await calculateRoute(from, to, avoidTolls);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
