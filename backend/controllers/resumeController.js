const path = require("path");
const fs   = require("fs");
const db   = require("../config/db");

const UPLOAD_DIR = path.join(__dirname, "..", process.env.UPLOAD_DIR || "uploads");

async function uploadResume(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ success:false, message:"No file uploaded." });
    const { originalname, filename, size, mimetype } = req.file;
    const [r] = await db.query(
      "INSERT INTO resumes (user_id,original_name,stored_name,file_size,mime_type,uploaded_at) VALUES (?,?,?,?,?,NOW())",
      [req.user.id, originalname, filename, size, mimetype]
    );
    return res.status(201).json({ success:true, id:r.insertId, filename:originalname, url:`/uploads/${filename}` });
  } catch (err) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    next(err);
  }
}

async function getHistory(req, res, next) {
  try {
    const [rows] = await db.query(
      `SELECT r.id,r.original_name AS filename,r.file_size,r.uploaded_at,
              a.ats_score,a.created_at AS analyzed_at
       FROM resumes r LEFT JOIN analyses a ON a.resume_id=r.id
       WHERE r.user_id=? ORDER BY r.uploaded_at DESC LIMIT 20`,
      [req.user.id]
    );
    return res.json({ success:true, history:rows });
  } catch (err) { next(err); }
}

async function getResume(req, res, next) {
  try {
    const [rows] = await db.query(
      `SELECT r.*,a.ats_score,a.skills,a.gaps,a.insights
       FROM resumes r LEFT JOIN analyses a ON a.resume_id=r.id
       WHERE r.id=? AND r.user_id=? LIMIT 1`,
      [req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ success:false, message:"Resume not found." });
    return res.json({ success:true, resume:rows[0] });
  } catch (err) { next(err); }
}

async function deleteResume(req, res, next) {
  try {
    const [rows] = await db.query(
      "SELECT stored_name FROM resumes WHERE id=? AND user_id=? LIMIT 1",
      [req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ success:false, message:"Resume not found." });
    const fp = path.join(UPLOAD_DIR, rows[0].stored_name);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
    await db.query("DELETE FROM resumes WHERE id=?", [req.params.id]);
    return res.json({ success:true, message:"Resume deleted." });
  } catch (err) { next(err); }
}

module.exports = { uploadResume, getHistory, getResume, deleteResume };
