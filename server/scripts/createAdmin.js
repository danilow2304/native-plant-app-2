// Usage (from the server folder): node scripts/createAdmin.js <username> <password>
import bcrypt from "bcryptjs";
import { admins } from "../db.js";

const [username, password] = process.argv.slice(2);
if (!username || !password) {
  console.error("Usage: node scripts/createAdmin.js <username> <password>");
  process.exit(1);
}

// Password policy: 12+ chars with upper, lower, digit, symbol.
const strong =
  password.length >= 12 &&
  /[a-z]/.test(password) && /[A-Z]/.test(password) &&
  /\d/.test(password) && /[^A-Za-z0-9]/.test(password);
if (!strong) {
  console.error("Password must be 12+ characters with upper, lower, number, and symbol.");
  process.exit(1);
}

const passwordHash = await bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS) || 12);
await admins.updateOne(
  { username: username.toLowerCase() },
  { $set: { passwordHash } },
  { upsert: true }
);
console.log(`Admin "${username}" saved.`);
process.exit(0);
