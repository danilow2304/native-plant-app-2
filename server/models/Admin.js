const mongoose = require('mongoose');

// Stores ONLY the bcrypt hash, never the plain-text password.
const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema, 'admins');
