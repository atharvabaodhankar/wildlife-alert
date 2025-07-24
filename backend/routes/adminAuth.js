const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const router = express.Router();

/**
 * @route   POST /api/admin/signup
 * @desc    Admin Signup
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      name,
      email,
      password: hashedPassword
    });

    await admin.save();

    const token = jwt.sign(
      { id: admin._id, name: admin.name, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      admin: { name: admin.name, email: admin.email }
    });
  } catch (err) {
    console.error('Admin Signup Error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

/**
 * @route   POST /api/admin/login
 * @desc    Admin Login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(403).json({ message: 'Admin access denied' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: admin._id, name: admin.name, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      admin: { name: admin.name, email: admin.email }
    });
  } catch (err) {
    console.error('Admin Login Error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
