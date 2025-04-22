const IncidentStat = require('../models/incidentStat.model');

exports.getIncidentsByType = async () => {
  return await IncidentStat.aggregate([
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);
};
