// Usage: node scripts/createAdmin.js <username> <password>
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

(async () => {
  const [username, password] = process.argv.slice(2);
  if (!username || !password) {
    console.error('Usage: node scripts/createAdmin.js <username> <password>');
    process.exit(1);
  }
  // Password policy: 12+ chars with upper, lower, digit, symbol.
  const strong = password.length >= 12 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password);
  if (!strong) {
    console.error('Password must be 12+ characters with upper, lower, number, and symbol.');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  const passwordHash = await bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS) || 12);
  await Admin.findOneAndUpdate({ username: username.toLowerCase() }, { passwordHash }, { upsert: true, new: true });
  console.log(`Admin "${username}" saved.`);
  await mongoose.disconnect();
})();
