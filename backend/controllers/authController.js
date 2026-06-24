const authService               = require("../services/authService");
const { buildTokenResponse,
        verifyRefreshToken,
        generateAccessToken }   = require("../utils/generateToken");

// ── Demo mode fallback when DB is unavailable ─────────────────────────────────
const DEMO_USERS = [
  { id:1, name:"Demo User",      email:"demo@resumeai.app",  password:"password123" },
  { id:2, name:"Test User",      email:"test@test.com",       password:"password123" },
];

function isDemoLogin(email, password) {
  return DEMO_USERS.find(u => u.email === email.toLowerCase().trim() && u.password === password);
}

function demoToken(user) {
  const safe = { id:user.id, name:user.name, email:user.email };
  const { buildTokenResponse } = require("../utils/generateToken");
  return buildTokenResponse(safe);
}

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name?.trim() || name.trim().length < 2)
      return res.status(400).json({ success:false, message:"Name must be at least 2 characters." });
    if (!email?.trim())
      return res.status(400).json({ success:false, message:"Email is required." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ success:false, message:"Enter a valid email address." });
    if (!password || password.length < 8)
      return res.status(400).json({ success:false, message:"Password must be at least 8 characters." });

    const user     = await authService.createUser({ name, email, password });
    const response = buildTokenResponse(user);
    return res.status(201).json({ success:true, ...response });
  } catch (err) {
    // Duplicate email
    if (err.status === 409 || err.message?.includes("already in use") || err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ success:false, message:"Email already in use. Please sign in instead." });
    // DB unavailable — check if demo account
    if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND" || err.message?.includes("ECONNREFUSED")) {
      return res.status(503).json({ success:false, message:"Database unavailable. Try demo@resumeai.app / password123." });
    }
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password)
      return res.status(400).json({ success:false, message:"Email and password are required." });

    // Try DB first
    try {
      const dbUser = await authService.findByEmail(email);
      if (!dbUser) {
        // Check demo fallback before returning error
        const demo = isDemoLogin(email, password);
        if (demo) return res.json({ success:true, ...demoToken(demo) });
        return res.status(401).json({ success:false, message:"Invalid email or password." });
      }

      const valid = await authService.verifyPassword(password, dbUser.password_hash);
      if (!valid)
        return res.status(401).json({ success:false, message:"Invalid email or password." });

      return res.json({ success:true, ...buildTokenResponse(dbUser) });
    } catch (dbErr) {
      // DB down — try demo credentials so app still works
      const demo = isDemoLogin(email, password);
      if (demo) {
        return res.json({ success:true, ...demoToken(demo), _demo:true });
      }
      // DB error but not demo — surface the real issue
      if (dbErr.code === "ECONNREFUSED" || dbErr.message?.includes("ECONNREFUSED") || dbErr.message?.includes("connect")) {
        return res.status(503).json({
          success: false,
          message: "Cannot connect to database. Please check DB_PASSWORD in backend/.env. Demo: demo@resumeai.app / password123"
        });
      }
      throw dbErr;
    }
  } catch (err) { next(err); }
}

// POST /api/auth/refresh
async function refreshToken(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ success:false, message:"refreshToken required." });

    const payload = verifyRefreshToken(refreshToken);
    const token   = generateAccessToken({ id:payload.id });
    return res.json({ success:true, token });
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError")
      return res.status(401).json({ success:false, message:"Invalid or expired refresh token." });
    next(err);
  }
}

// GET /api/auth/me
async function getMe(req, res, next) {
  try {
    // Try DB, fall back to token payload
    try {
      const user = await authService.findById(req.user.id);
      if (user) return res.json({ success:true, user });
    } catch { /* DB down */ }
    // Return token payload as user
    return res.json({ success:true, user:req.user });
  } catch (err) { next(err); }
}

// POST /api/auth/logout
function logout(req, res) {
  return res.json({ success:true, message:"Logged out." });
}

// POST /api/auth/change-password
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success:false, message:"Both passwords are required." });
    if (newPassword.length < 8)
      return res.status(400).json({ success:false, message:"New password must be at least 8 characters." });

    const dbUser = await authService.findByEmail(req.user.email);
    if (!dbUser)
      return res.status(404).json({ success:false, message:"User not found." });

    const valid = await authService.verifyPassword(currentPassword, dbUser.password_hash);
    if (!valid)
      return res.status(401).json({ success:false, message:"Current password is incorrect." });

    await authService.updatePassword(req.user.id, newPassword);
    return res.json({ success:true, message:"Password updated." });
  } catch (err) { next(err); }
}

// PUT /api/user/profile
async function updateProfile(req, res, next) {
  try {
    try {
      const updated = await authService.updateProfile(req.user.id, req.body);
      return res.json({ success:true, user:updated });
    } catch {
      // DB down — return merged user
      return res.json({ success:true, user:{ ...req.user, ...req.body } });
    }
  } catch (err) { next(err); }
}

module.exports = { register, login, refreshToken, getMe, logout, changePassword, updateProfile };
