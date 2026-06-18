const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  phone: {
    type: String
  },

  cropType: {
    type: String
  },

  plotSize: {
    type: Number
  },

landBoundary: {
  type: {
    type: String,
    default: "Polygon"
  },

  coordinates: {
    type: [[[Number]]]
  }
},

  registeredAt: {
    type: Date,
    default: Date.now
  }
});

// Geospatial Index
farmerSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Farmer", farmerSchema);