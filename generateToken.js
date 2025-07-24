const jwt = require("jsonwebtoken");

// Use your actual JWT secret from the .env file
const secret = "supersecretkey123"; // <-- replace this if needed

const token = jwt.sign(
  {
    id: "687e82f41b5321013c6add45",
    name: "Super Admin",
    email: "admin@example.com",
    role: "admin"
  },
  secret,
  { expiresIn: "24h" }
);

console.log("Generated JWT Token:\n", token);
