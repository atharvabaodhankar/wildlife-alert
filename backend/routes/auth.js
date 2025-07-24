const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ✅ USER SIGNUP
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, role: "user" });
    await user.save();

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ success: false, message: "Signup failed", error: error.message });
  }
});

// ✅ USER LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ success: true, token, name: user.name, role: user.role });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

// ✅ TEMPORARY ADMIN SIGNUP (USE ONCE THEN DELETE OR PROTECT)
router.post("/adminSignup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();
    res.status(201).json({ success: true, message: "Admin account created successfully" });
  } catch (err) {
    console.error("Admin Signup Error:", err);
    res.status(500).json({ success: false, message: "Admin signup failed" });
  }
});

module.exports = router;
