const express     = require("express");
const bcrypt      = require("bcryptjs");
const jwt         = require("jsonwebtoken");
const db          = require("../config/db");

const router = express.Router();

// ── Helpers ───────────────────────────────────────────────────────────────────
function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || "dev_secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || "dev_refresh_secret", {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  });
}

// Middleware: verify JWT on protected routes
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return res.status(401).json({ success: false, message: "No token provided" });

  try {
    req.user = jwt.verify(
      header.split(" ")[1],
      process.env.JWT_SECRET || "dev_secret"
    );
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

// ── POST /api/auth/register ───────────────────────────────────────────────────
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "name, email and password are required" });

    if (password.length < 8)
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });

    // Check duplicate email
    const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (rows.length > 0)
      return res.status(409).json({ success: false, message: "Email already in use" });

    const hash = await bcrypt.hash(password, 12);

    const [result] = await db.query(
      "INSERT INTO users (name, email, password_hash, created_at) VALUES (?, ?, ?, NOW())",
      [name.trim(), email.toLowerCase().trim(), hash]
    );

    const user  = { id: result.insertId, name: name.trim(), email: email.toLowerCase().trim() };
    const token = signToken(user);

    res.status(201).json({ success: true, user, token });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "email and password are required" });

    const [rows] = await db.query(
      "SELECT id, name, email, password_hash, title, location FROM users WHERE email = ?",
      [email.toLowerCase().trim()]
    );

    if (rows.length === 0)
      return res.status(401).json({ success: false, message: "Invalid email or password" });

    const dbUser = rows[0];
    const valid  = await bcrypt.compare(password, dbUser.password_hash);

    if (!valid)
      return res.status(401).json({ success: false, message: "Invalid email or password" });

    const user  = { id: dbUser.id, name: dbUser.name, email: dbUser.email, title: dbUser.title, location: dbUser.location };
    const token = signToken(user);
    const refreshToken = signRefreshToken({ id: user.id });

    res.json({ success: true, user, token, refreshToken });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/auth/refresh ────────────────────────────────────────────────────
router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(400).json({ success: false, message: "refreshToken required" });

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "dev_refresh_secret");
    const token   = signToken({ id: payload.id });
    res.json({ success: true, token });
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
  }
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get("/me", auth, async (req, res, next) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email, title, location, website, bio, created_at FROM users WHERE id = ?",
      [req.user.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user: rows[0] });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
// JWT is stateless — client deletes token. This endpoint exists for consistency.
router.post("/logout", auth, (req, res) => {
  res.json({ success: true, message: "Logged out" });
});

// ── POST /api/auth/change-password ────────────────────────────────────────────
router.post("/change-password", auth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: "Both passwords are required" });

    if (newPassword.length < 8)
      return res.status(400).json({ success: false, message: "New password must be at least 8 characters" });

    const [rows] = await db.query("SELECT password_hash FROM users WHERE id = ?", [req.user.id]);
    const valid  = await bcrypt.compare(currentPassword, rows[0].password_hash);

    if (!valid)
      return res.status(401).json({ success: false, message: "Current password is incorrect" });

    const hash = await bcrypt.hash(newPassword, 12);
    await db.query("UPDATE users SET password_hash = ? WHERE id = ?", [hash, req.user.id]);

    res.json({ success: true, message: "Password updated" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
