const express = require('express');
const multer = require('multer');
const path = require('path');
const Sighting = require('../models/Sighting');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

// ✅ Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname); // safer than split('.')
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage: storage });

/**
 * ✅ POST /api/sightings
 * Create a new sighting (requires login + token)
 */
router.post('/', authenticateJWT, upload.single('image'), async (req, res) => {
  try {
    const { animal, location, date } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const sighting = new Sighting({
      animal,
      location,
      date: new Date(date), // ✅ ensure ISO format for date analytics
      imageUrl,
      userId: req.user.userId // ✅ renamed from "user" to "userId"
    });

    await sighting.save();
    res.status(201).json({ message: "Sighting added successfully", sighting });
  } catch (error) {
    console.error("Error saving sighting:", error);
    res.status(500).json({ error: "Failed to add sighting" });
  }
});

/**
 * ✅ GET /api/sightings
 * Get all sightings for the logged-in user
 */
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const sightings = await Sighting.find({ userId: req.user.userId }).populate('userId', 'name email');
    res.json(sightings);
  } catch (error) {
    console.error("Error fetching sightings:", error);
    res.status(500).json({ error: "Failed to fetch sightings" });
  }
});

module.exports = router;
