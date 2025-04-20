const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  type: { type: String, enum: ['accident', 'traffic', 'police', 'obstacle'], required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  createdAt: { type: Date, default: Date.now },
  confirmations: [{
    userId: String,
    confirmed: Boolean
  }]
});

incidentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Incident', incidentSchema);
