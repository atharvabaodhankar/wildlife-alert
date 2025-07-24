const express = require('express');
const Sighting = require('../models/Sighting');
const Admin = require('../models/Admin');
const { authenticateJWT, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// ✅ Admin Dashboard - get admin info
router.get('/dashboard', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password'); // exclude password
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json({
      name: admin.name,
      email: admin.email,
      id: admin._id
    });
  } catch (err) {
    console.error('[ERROR] Admin dashboard route:', err);
    res.status(500).json({ error: 'Failed to fetch admin info' });
  }
});

// ✅ Get all sightings (admin only)
router.get('/all-sightings', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const sightings = await Sighting.find().populate('userId', 'name email');
    res.json(sightings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sightings' });
  }
});

// ✅ Delete a sighting (admin only)
router.delete('/sighting/:id', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    await Sighting.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sighting deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete sighting' });
  }
});

// ✅ Edit or approve a sighting (admin only)
router.patch('/sighting/:id', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const updateFields = req.body; // Allow updating any field
    const updated = await Sighting.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update sighting' });
  }
});

module.exports = router;
