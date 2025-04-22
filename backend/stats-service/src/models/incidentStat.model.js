const mongoose = require('mongoose');

const incidentStatSchema = new mongoose.Schema({
  type: String,
  location: [Number], 
  userId: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('IncidentStat', incidentStatSchema);
