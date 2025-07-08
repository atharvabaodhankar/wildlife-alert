const express = require('express');
const Sighting = require('../models/Sighting');
const { authenticateJWT, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all sightings (admin only)
router.get('/all-sightings', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const sightings = await Sighting.find().populate('user', 'name email');
    res.json(sightings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sightings' });
  }
});

// Delete a sighting
router.delete('/sighting/:id', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    await Sighting.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sighting deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete sighting' });
  }
});

// Approve a sighting (e.g., set status: approved/pending)
router.patch('/sighting/:id', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Sighting.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update sighting status' });
  }
});

module.exports = router;
