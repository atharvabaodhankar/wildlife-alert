const jwt = require("jsonwebtoken");

// Middleware to verify token and attach user info
function authenticateJWT(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}

// Middleware to allow only admin users
function requireAdmin(req, res, next) {
  if (req.user?.role === "admin") return next();
  return res.status(403).json({ error: "Admin access required" });
}

module.exports = { authenticateJWT, requireAdmin };
