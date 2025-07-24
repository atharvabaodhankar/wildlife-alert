// middleware/auth.js

const User = require('../models/User');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// ✅ Auth middleware
const authenticateJWT = async (req, res, next) => {
  console.log('--- authenticateJWT middleware called ---');
  const token = req.header('Authorization')?.split(' ')[1];
  console.log('Auth middleware: received token:', token);
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded JWT payload:', decoded);

    // Try to find user in User collection
    let user = await User.findById(decoded.id);
    console.log('User lookup result:', user);
    if (user) {
      req.user = { userId: user._id, isAdmin: false };
      return next();
    }

    // Try to find user in Admin collection
    // Try to find user in Admin collection
let admin = await Admin.findById(decoded.id); // 🔥 Corrected line
console.log('Admin lookup result:', admin);
if (admin) {
  req.user = { userId: admin._id, isAdmin: true, role: 'admin' };
  return next();
}

    return res.status(403).json({ message: 'Access denied' });
  } catch (err) {
    console.error('JWT verification error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ✅ Optional: Admin-only middleware
const requireAdmin = (req, res, next) => {
  console.log('requireAdmin check:', req.user); // Debug log
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// ✅ Export as object for destructuring
module.exports = {
  authenticateJWT,
  requireAdmin
};
