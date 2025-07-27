const express = require("express");
const router = express.Router();

// POST /api/alerts - Admin generates a real-time alert
router.post("/", (req, res) => {
  const io = req.app.get("io"); // Get Socket.IO instance
  const { message, location, pincode, severity, latitude, longitude } = req.body;

  const alertData = {
    message,
    location,
    pincode,
    severity,
    latitude,
    longitude,
    timestamp: new Date(),
  };

  // Emit alert to all connected clients
  io.emit("alert", alertData);

  res.status(200).json({ success: true, alert: alertData });
});

module.exports = router;
