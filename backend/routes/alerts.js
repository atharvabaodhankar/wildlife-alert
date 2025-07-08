const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");

router.post("/", async (req, res) => {
  const io = req.app.get("io");
  const { message, location, pincode, severity, latitude, longitude } = req.body;

  try {
    // Create and save new alert
    const alert = new Alert({
      message,
      location,
      pincode,
      severity,
      latitude,
      longitude,
    });

    await alert.save();

    // Emit real-time alert to all connected users
    io.emit("alert", alert);

    res.status(200).json({ success: true, alert });
  } catch (err) {
    console.error("Alert Error:", err);
    res.status(500).json({ error: "Failed to send alert" });
  }
});

module.exports = router;
