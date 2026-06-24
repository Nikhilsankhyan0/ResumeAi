const path      = require("path");
const fs        = require("fs");
const mlService = require("./mlService");
const Resume    = require("../models/Resume");

const UPLOAD_DIR = path.join(__dirname, "..", process.env.UPLOAD_DIR || "uploads");

const recommendationService = {

  async analyzeAndSave({ userId, file, jdText = "", targetRole = null }) {
    const record = await Resume.create({
      userId,
      originalName: file.originalname,
      storedName:   file.filename,
      fileSize:     file.size,
      mimeType:     file.mimetype,
    });

    const analysis = await mlService.analyzeResume(file.path, jdText, targetRole);

    await Resume.saveAnalysis({
      resumeId: record.id,
      atsScore: analysis.ats_score,
      skills:   analysis.skills,
      gaps:     analysis.missing_skills,
      insights: analysis.insights,
    });

    return { resumeId: record.id, ...analysis };
  },

  async getJobMatches(skills, targetRole = null, topN = 5, detectedRole = null) {
    const result = await mlService.getRecommendations(skills, targetRole, topN, detectedRole);
    return {
      jobs:           result.job_listings,
      roles:          result.recommended_roles,
      matched_skills: result.matched_skills,
      missing_skills: result.missing_skills,
    };
  },

  async getMissingSkills(skills, targetRole) {
    const result = await mlService.getRecommendations(skills, targetRole, 1);
    const detail = result.target_role_detail || result.recommended_roles?.[0] || {};
    return {
      target_role:    targetRole || detail.role || "General",
      match_score:    detail.match_score ?? 0,
      matched_skills: detail.matched_skills ?? [],
      missing_skills: detail.missing_skills ?? [],
      all_roles:      result.recommended_roles,
    };
  },

  async rescoreATS(resumeId, userId, jdText) {
    const record = await Resume.findById(resumeId, userId);
    if (!record) { const e = new Error("Resume not found."); e.status = 404; throw e; }
    const filePath = path.join(UPLOAD_DIR, record.stored_name);
    if (!fs.existsSync(filePath)) { const e = new Error("Resume file missing."); e.status = 404; throw e; }
    const parsed = await mlService.parseResume(filePath);
    return mlService.calculateATS(parsed, jdText);
  },

  async getHistory(userId) {
    return Resume.findByUser(userId);
  },
};

module.exports = recommendationService;
