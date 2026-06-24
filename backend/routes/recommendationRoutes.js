const express     = require("express");
const multer      = require("multer");
const path        = require("path");
const fs          = require("fs");
const { protect } = require("../middleware/authMiddleware");
const mlService   = require("../services/mlService");
const Resume      = require("../models/Resume");

const router = express.Router();

// ── Multer config ──────────────────────────────────────────────────────────────
const UPLOAD_DIR = path.join(__dirname, "..", process.env.UPLOAD_DIR || "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename:    (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${req.user.id}_${Date.now()}_${safe}`);
  },
});

const ALLOWED_MIME = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

const upload = multer({
  storage,
  limits: { fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 5) * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    ALLOWED_MIME.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Only PDF and DOCX files are supported")),
});


// ── POST /api/recommendations/analyze ─────────────────────────────────────────
// Upload resume + optional JD → run full ML pipeline → return analysis
router.post(
  "/analyze",
  protect,
  upload.single("resume"),
  async (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No resume file uploaded." });
    }

    const filePath   = req.file.path;
    const jdText     = (req.body.jd_text     || "").trim();
    const targetRole = (req.body.target_role || "").trim() || null;

    try {
      // Save upload record
      const record = await Resume.create({
        userId:       req.user.id,
        originalName: req.file.originalname,
        storedName:   req.file.filename,
        fileSize:     req.file.size,
        mimeType:     req.file.mimetype,
      });

      // Run ML pipeline
      const analysis = await mlService.analyzeResume(filePath, jdText, targetRole);

      // Persist ATS result
      await Resume.saveAnalysis({
        resumeId: record.id,
        atsScore: analysis.ats_score,
        skills:   analysis.skills,
        gaps:     analysis.missing_skills,
        insights: analysis.insights,
      });

      return res.status(201).json({
        success:   true,
        resume_id: record.id,
        ...analysis,
      });
    } catch (err) {
      // Clean up file on error
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      next(err);
    }
  }
);


// ── POST /api/recommendations/score ───────────────────────────────────────────
// ATS score only — pass resume_id (already uploaded) + JD text
router.post("/score", protect, async (req, res, next) => {
  try {
    const { resume_id, jd_text = "" } = req.body;
    if (!resume_id) {
      return res.status(400).json({ success: false, message: "resume_id is required." });
    }

    const record = await Resume.findById(resume_id, req.user.id);
    if (!record) {
      return res.status(404).json({ success: false, message: "Resume not found." });
    }

    const filePath = path.join(UPLOAD_DIR, record.stored_name);
    const parsed   = await mlService.parseResume(filePath);
    const ats      = await mlService.calculateATS(parsed, jd_text);

    return res.json({ success: true, ...ats });
  } catch (err) {
    next(err);
  }
});


// ── GET /api/recommendations/jobs ─────────────────────────────────────────────
// Job recommendations for the user's latest analyzed resume
router.get("/jobs", protect, async (req, res, next) => {
  try {
    const skillsParam = req.query.skills || "";
    const targetRole  = req.query.role   || null;
    const topN        = parseInt(req.query.top_n, 10) || 5;

    const skills = skillsParam
      ? skillsParam.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const result = await mlService.getRecommendations(skills, targetRole, topN);

    return res.json({
      success: true,
      jobs:    result.job_listings,
      roles:   result.recommended_roles,
      missing_skills: result.missing_skills,
      matched_skills: result.matched_skills,
    });
  } catch (err) {
    next(err);
  }
});


// ── POST /api/recommendations/missing-skills ──────────────────────────────────
// Missing skills analysis for a specific role
router.post("/missing-skills", protect, async (req, res, next) => {
  try {
    const { skills = [], target_role } = req.body;

    const result = await mlService.getRecommendations(skills, target_role, 1);

    return res.json({
      success:        true,
      target_role:    target_role || result.recommended_roles?.[0]?.role,
      matched_skills: result.matched_skills,
      missing_skills: result.missing_skills,
      match_score:    result.target_role_detail?.match_score ?? 0,
    });
  } catch (err) {
    next(err);
  }
});


// ── Multer error handler ───────────────────────────────────────────────────────
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message?.includes("Only PDF")) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next(err);
});

module.exports = router;
