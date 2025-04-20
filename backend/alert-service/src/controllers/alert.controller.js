const Alert = require('../models/alert.model');


exports.getRecentAlerts = async (req, res) => {
  const hours = parseInt(req.query.hours) || 2; 
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const alerts = await Alert.find({ timestamp: { $gte: since } }).sort({ timestamp: -1 });
  res.json(alerts);
};
