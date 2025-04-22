const mongoose = require('mongoose');

const routeStatSchema = new mongoose.Schema({
  from: [Number], 
  to: [Number],
  duration: Number, 
  createdAt: { type: Date, default: Date.now },
  userId: String
});

module.exports = mongoose.model('RouteStat', routeStatSchema);
