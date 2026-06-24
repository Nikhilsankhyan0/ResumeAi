const express      = require("express");
const multer       = require("multer");
const path         = require("path");
const fs           = require("fs");
const { protect }  = require("../middleware/authMiddleware");
const authCtrl     = require("../controllers/authController");
const resumeCtrl   = require("../controllers/resumeController");
const recCtrl      = require("../controllers/recommendationController");

const router = express.Router();

// ── Multer ─────────────────────────────────────────────────────────────────────
const UPLOAD_DIR = path.join(__dirname, "..", process.env.UPLOAD_DIR || "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename:    (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${req.user?.id ?? "anon"}_${Date.now()}_${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 5) * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ].includes(file.mimetype);
    ok ? cb(null, true) : cb(new Error("Only PDF and DOCX files are supported"));
  },
});

// ── Auth (public) ──────────────────────────────────────────────────────────────
router.post("/auth/register",          authCtrl.register);
router.post("/auth/login",             authCtrl.login);
router.post("/auth/refresh",           authCtrl.refreshToken);
router.post("/auth/logout",  protect,  authCtrl.logout);
router.post("/auth/change-password", protect, authCtrl.changePassword);

// ── Current user ───────────────────────────────────────────────────────────────
router.get("/auth/me",       protect, authCtrl.getMe);
router.get("/user/profile",  protect, authCtrl.getMe);
router.put("/user/profile",  protect, authCtrl.updateProfile);

// ── Resume CRUD ────────────────────────────────────────────────────────────────
router.post("/resume/upload",  protect, upload.single("resume"), resumeCtrl.uploadResume);
router.get( "/resume/history", protect, resumeCtrl.getHistory);
router.get( "/resume/:id",     protect, resumeCtrl.getResume);
router.delete("/resume/:id",   protect, resumeCtrl.deleteResume);

// ── ML / Recommendations ───────────────────────────────────────────────────────
router.post("/recommendations/analyze",        protect, upload.single("resume"), recCtrl.analyze);
router.post("/recommendations/score",          protect, recCtrl.scoreResume);
router.get( "/recommendations/jobs",           protect, recCtrl.getJobs);
router.post("/recommendations/missing-skills", protect, recCtrl.missingSkills);
router.get( "/recommendations/history",        protect, recCtrl.getHistory);

// ── Multer error handler ───────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message?.includes("Only PDF")) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next(err);
});

module.exports = router;

// ── Debug / health check for DB ───────────────────────────────────────────────
router.get("/auth/status", async (req, res) => {
  try {
    const db = require("../config/db");
    await db.testConnection();
    res.json({ success:true, db:"connected", ts:new Date().toISOString() });
  } catch (err) {
    res.json({ success:false, db:"disconnected", error:err.message, fix:"Check DB_PASSWORD in backend/.env" });
  }
});
