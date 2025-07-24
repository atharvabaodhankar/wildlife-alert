const mongoose = require('mongoose');
const connectDB = require('./backend/db');
const Admin = require('./backend/models/Admin');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  try {
    await connectDB(); // 🔗 Ensures single mongoose instance is used

    const existing = await Admin.findOne({ email: 'admin@example.com' });
    if (existing) {
      console.log("⚠️ Admin already exists.");
    } else {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Super Admin',
        role: 'admin'
      });
      console.log("✅ Admin user created.");
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error during seeding:", err);
  }
}

seedAdmin();
