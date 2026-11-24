import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { admins } from "../db.js";
import requireAuth from "../middleware/auth.js";
import { loginRules, handleValidation } from "../middleware/validate.js";

const router = express.Router();

// Slows brute-force guessing: 10 attempts per 15 minutes per IP.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Try again later." },
});

// Used when the username doesn't exist, so response time doesn't reveal valid usernames.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

router.post("/login", loginLimiter, loginRules, handleValidation, async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await admins.findOne({ username: username.toLowerCase() });

    const ok = await bcrypt.compare(password, admin ? admin.passwordHash : DUMMY_HASH);
    if (!admin || !ok) {
      // Same message either way: don't reveal which part was wrong.
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );
    res.json({ token, username: admin.username });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ username: req.admin.username });
});

export default router;
