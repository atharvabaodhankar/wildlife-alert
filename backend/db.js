const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load .env
dotenv.config({ path: path.join(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ [DB] Connected to MongoDB');
  } catch (err) {
    console.error('❌ [DB] Mongo connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
