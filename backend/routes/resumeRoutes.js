const express  = require("express");
const multer   = require("multer");
const path     = require("path");
const fs       = require("fs");
const jwt      = require("jsonwebtoken");
const db       = require("../config/db");

const router = express.Router();

// ── Auth middleware ───────────────────────────────────────────────────────────
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return res.status(401).json({ success: false, message: "No token provided" });
  try {
    req.user = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET || "dev_secret");
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

// ── Multer storage ────────────────────────────────────────────────────────────
const uploadDir = path.join(__dirname, "..", process.env.UPLOAD_DIR || "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename:    (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${req.user.id}_${Date.now()}_${safe}`);
  },
});

const ALLOWED_MIMES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

const upload = multer({
  storage,
  limits: { fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 5) * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (ALLOWED_MIMES.includes(file.mimetype)) return cb(null, true);
    cb(new Error("Only PDF and DOCX files are supported"));
  },
});

// ── POST /api/resume/upload ───────────────────────────────────────────────────
router.post("/upload", auth, upload.single("resume"), async (req, res, next) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "No file uploaded" });

    // Save record to DB
    const [result] = await db.query(
      `INSERT INTO resumes (user_id, original_name, stored_name, file_size, mime_type, uploaded_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [req.user.id, req.file.originalname, req.file.filename, req.file.size, req.file.mimetype]
    );

    res.status(201).json({
      success:  true,
      id:       result.insertId,
      filename: req.file.originalname,
      url:      `/uploads/${req.file.filename}`,
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/resume/history ───────────────────────────────────────────────────
router.get("/history", auth, async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT r.id, r.original_name, r.uploaded_at, a.ats_score, a.created_at AS analyzed_at
       FROM resumes r
       LEFT JOIN analyses a ON a.resume_id = r.id
       WHERE r.user_id = ?
       ORDER BY r.uploaded_at DESC
       LIMIT 20`,
      [req.user.id]
    );
    res.json({ success: true, history: rows });
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/resume/:id ────────────────────────────────────────────────────
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const [rows] = await db.query(
      "SELECT stored_name FROM resumes WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "Resume not found" });

    // Remove file from disk
    const filePath = path.join(uploadDir, rows[0].stored_name);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await db.query("DELETE FROM resumes WHERE id = ?", [req.params.id]);

    res.json({ success: true, message: "Resume deleted" });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/user/profile ─────────────────────────────────────────────────────
router.get("/profile", auth, async (req, res, next) => {
  // Mounted at /api/resume but reused for profile to avoid extra route file
  // In a larger project, split this into /api/user/profile
  try {
    const [rows] = await db.query(
      "SELECT id, name, email, title, location, website, bio FROM users WHERE id = ?",
      [req.user.id]
    );
    if (!rows.length)
      return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    next(err);
  }
});

// Multer file-type error handler
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message?.includes("Only PDF")) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next(err);
});

module.exports = router;
