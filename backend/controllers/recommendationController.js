const fs                    = require("fs");
const recommendationService = require("../services/recommendationService");

async function analyze(req, res, next) {
  if (!req.file)
    return res.status(400).json({ success:false, message:"No resume file uploaded." });

  const jdText     = (req.body.jd_text     || "").trim();
  const targetRole = (req.body.target_role || "").trim() || null;

  try {
    const result = await recommendationService.analyzeAndSave({
      userId:     req.user.id,
      file:       req.file,
      jdText,
      targetRole,
    });
    return res.status(201).json({ success:true, ...result });
  } catch (err) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    next(err);
  }
}

async function scoreResume(req, res, next) {
  try {
    const { resume_id, jd_text = "" } = req.body;
    if (!resume_id)
      return res.status(400).json({ success:false, message:"resume_id is required." });
    const result = await recommendationService.rescoreATS(Number(resume_id), req.user.id, jd_text);
    return res.json({ success:true, ...result });
  } catch (err) { next(err); }
}

async function getJobs(req, res, next) {
  try {
    const skills       = (req.query.skills || "").split(",").map(s=>s.trim()).filter(Boolean);
    const targetRole   = req.query.role || null;
    const detectedRole = req.query.detected_role || null;
    const topN         = parseInt(req.query.top_n, 10) || 5;
    const result       = await recommendationService.getJobMatches(skills, targetRole, topN, detectedRole);
    return res.json({ success:true, ...result });
  } catch (err) { next(err); }
}

async function missingSkills(req, res, next) {
  try {
    const { skills = [], target_role } = req.body;
    const result = await recommendationService.getMissingSkills(skills, target_role);
    return res.json({ success:true, ...result });
  } catch (err) { next(err); }
}

async function getHistory(req, res, next) {
  try {
    const history = await recommendationService.getHistory(req.user.id);
    return res.json({ success:true, history });
  } catch (err) { next(err); }
}

module.exports = { analyze, scoreResume, getJobs, missingSkills, getHistory };
