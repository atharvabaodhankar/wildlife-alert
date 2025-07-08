const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema({
  message: { type: String, required: true },
  location: { type: String, required: true },
  pincode: { type: String },
  severity: { type: String, default: "Moderate" },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Alert", AlertSchema);
