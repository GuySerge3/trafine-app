const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['accident', 'traffic', 'police', 'obstacle', 'embouteillage', 'route barree', 'Autre'],
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true, // [longitude, latitude]
    },
  },
  description: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '', // ✅ L'adresse humaine (ex: 10 Rue de Paris, 75000)
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  confirmations: [
    {
      userId: String,
      confirmed: Boolean,
    },
  ],
});

// Index géospatial
incidentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Incident', incidentSchema);
