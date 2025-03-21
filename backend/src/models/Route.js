const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  start: { 
    latitude: { type: Number, required: true }, 
    longitude: { type: Number, required: true } 
  },
  end: { 
    latitude: { type: Number, required: true }, 
    longitude: { type: Number, required: true } 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Route", RouteSchema);
