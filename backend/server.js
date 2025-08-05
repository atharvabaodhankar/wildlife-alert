const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Initialize Socket.IO
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*", // Update to your frontend URL in production
    methods: ["GET", "POST"],
  },
});

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded images

// ✅ Attach Socket.IO to app so it can be accessed in routes
io.on("connection", (socket) => {
  console.log("🔗 User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

app.set("io", io); // Makes io accessible via req.app.get("io")

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Route Imports
const alertRoutes = require("./routes/alerts");        // Live alerts from admin
const authRoutes = require("./routes/auth");           // Signup/Login
const sightingRoutes = require("./routes/sightings");  // Wildlife sightings
const adminRoutes = require("./routes/admin");         // Admin dashboard routes
const adminAuthRoutes = require("./routes/adminAuth"); // Admin login routes
const animalRoutes = require("./routes/animals");      // Animal species database

// ✅ Route Mounting
app.use("/api/alerts", alertRoutes);        // Emits alerts via Socket.IO
app.use("/api/auth", authRoutes);
app.use("/api/sightings", sightingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/animals", animalRoutes);      // Animal species CRUD operations

// ✅ Root Check Route (optional)
app.get("/", (req, res) => {
  res.send("🌿 Wildlife Alert Backend is running.");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

