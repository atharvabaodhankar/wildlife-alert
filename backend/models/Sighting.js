const mongoose = require('mongoose');

const SightingSchema = new mongoose.Schema({
  animal: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  user: { // ✅ Renamed from userId to user
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Sighting', SightingSchema);
