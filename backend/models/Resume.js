const db = require("../config/db");

const Resume = {
  async create({ userId, originalName, storedName, fileSize, mimeType }) {
    const [r] = await db.query(
      "INSERT INTO resumes (user_id,original_name,stored_name,file_size,mime_type,uploaded_at) VALUES (?,?,?,?,?,NOW())",
      [userId, originalName, storedName, fileSize, mimeType]
    );
    return { id:r.insertId, userId, originalName, url:`/uploads/${storedName}` };
  },
  async saveAnalysis({ resumeId, atsScore, skills, gaps, insights }) {
    await db.query(
      `INSERT INTO analyses (resume_id,ats_score,skills,gaps,insights,created_at)
       VALUES (?,?,?,?,?,NOW())
       ON DUPLICATE KEY UPDATE ats_score=VALUES(ats_score),skills=VALUES(skills),
         gaps=VALUES(gaps),insights=VALUES(insights),created_at=NOW()`,
      [resumeId, atsScore, JSON.stringify(skills??[]), JSON.stringify(gaps??[]), JSON.stringify(insights??[])]
    );
  },
  async findById(id, userId) {
    const [rows] = await db.query(
      `SELECT r.*,a.ats_score,a.skills,a.gaps,a.insights,a.created_at AS analyzed_at
       FROM resumes r LEFT JOIN analyses a ON a.resume_id=r.id
       WHERE r.id=? AND r.user_id=? LIMIT 1`,
      [id, userId]
    );
    return rows.length ? Resume._parse(rows[0]) : null;
  },
  async findByUser(userId, limit = 20) {
    const [rows] = await db.query(
      `SELECT r.id,r.original_name AS filename,r.file_size,r.uploaded_at,
              a.ats_score,a.created_at AS analyzed_at
       FROM resumes r LEFT JOIN analyses a ON a.resume_id=r.id
       WHERE r.user_id=? ORDER BY r.uploaded_at DESC LIMIT ?`,
      [userId, limit]
    );
    return rows;
  },
  async delete(id, userId) {
    const [rows] = await db.query(
      "SELECT stored_name FROM resumes WHERE id=? AND user_id=? LIMIT 1", [id, userId]
    );
    if (!rows.length) return null;
    await db.query("DELETE FROM resumes WHERE id=?", [id]);
    return rows[0].stored_name;
  },
  _parse(row) {
    const p = v => { try { return typeof v === "string" ? JSON.parse(v) : (v ?? []); } catch { return []; } };
    return { ...row, skills:p(row.skills), gaps:p(row.gaps), insights:p(row.insights) };
  },
};

module.exports = Resume;
