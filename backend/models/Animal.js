const mongoose = require("mongoose");

const AnimalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Animal name is required"],
    trim: true
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true
  },
  habitat: {
    type: String,
    required: [true, "Habitat is required"],
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Animal", AnimalSchema);