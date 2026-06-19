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

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  status: {
    type: String,
    enum: [
      "pending",
      "approved",
      "rejected"
    ],
    default: "pending"
  },

  location: {

  type: {
    type: String,
    default: "Point"
  },

  coordinates: {
    type: [Number]
  }

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

farmerSchema.index({
  location: "2dsphere"
});

farmerSchema.index({
  landBoundary: "2dsphere"
});

module.exports =
  mongoose.model(
    "Farmer",
    farmerSchema
  );