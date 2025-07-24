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
    type: Date, // ✅ Enables date queries and analytics
    required: true
  },
  imageUrl: {
    type: String
  },
  userId: { // ✅ Renamed from 'user' to 'userId'
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved' // 🔁 adjust based on your admin flow
  }
});

module.exports = mongoose.model('Sighting', SightingSchema);
