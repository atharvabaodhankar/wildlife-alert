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
    origin: "*",
  },
});

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded images

// ✅ Attach Socket.IO to the app
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});
app.set("io", io);

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected ✅"))
.catch((err) => console.error("MongoDB connection error:", err));

// ✅ Routes
const alertRoutes = require("./routes/alerts");
const authRoutes = require("./routes/auth");
const sightingRoutes = require("./routes/sightings"); // ✅ Add this

app.use("/api/alerts", alertRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/sightings", sightingRoutes); // ✅ Register sightings route

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
