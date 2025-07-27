const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if token is provided
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Access denied" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Decoded JWT:', decoded);

    // Use decoded.userId (or fallback to decoded.id if needed)
    const id = decoded.userId || decoded.id;
    if (!id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Check if it's a regular user
    let user = await User.findById(id);
    if (user) {
      req.user = { userId: user._id, name: user.name, role: 'user' };
      return next();
    }

    // Check if it's an admin
    let admin = await Admin.findById(id);
    if (admin) {
      req.user = { userId: admin._id, name: admin.name, role: 'admin' };
      return next();
    }

    return res.status(403).json({ message: "Access denied" });
  } catch (error) {
    console.error("❌ JWT verification failed:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Optional middleware to restrict access to admins only
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Admin access required' });
};

module.exports = {
  authenticateJWT,
  requireAdmin,
};
