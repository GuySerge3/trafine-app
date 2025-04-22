const RouteStat = require('../models/routeStat.model');

exports.getTopRoutes = async (limit = 5) => {
  return await RouteStat.aggregate([
    {
      $group: {
        _id: { from: "$from", to: "$to" },
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: limit }
  ]);
};
