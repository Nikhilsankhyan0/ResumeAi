const axios  = require("axios");
const Resume = require("../models/Resume");

const ML_API = process.env.ML_API_URL || "http://localhost:8000";

/**
 * resumeService — business logic layer between the controller and the ML API.
 * Controllers call these functions; they talk to the model and/or ML API.
 */
const resumeService = {

  /**
   * Persist an uploaded file record.
   * Called right after multer saves the file to disk.
   */
  async saveUpload({ userId, originalName, storedName, fileSize, mimeType }) {
    return Resume.create({ userId, originalName, storedName, fileSize, mimeType });
  },

  /**
   * Send a resume to the Python ML API for analysis and save the result.
   *
   * @param {number} resumeId  - DB id of the already-uploaded resume
   * @param {string} filePath  - absolute path on disk (sent to ML service)
   * @returns {object}         - full analysis result (ats_score, skills, gaps, insights, job_matches)
   */
  async analyze(resumeId, filePath) {
    let mlResult;

    try {
      const { data } = await axios.post(`${ML_API}/analyze`, {
        resume_id:   resumeId,
        file_path:   filePath,
      });
      mlResult = data;
    } catch (err) {
      // If ML service is unreachable (dev without Python), return sensible mock
      if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
        mlResult = resumeService._mockAnalysis(resumeId);
      } else {
        throw err;
      }
    }

    // Persist to analyses table
    await Resume.saveAnalysis({
      resumeId,
      atsScore: mlResult.ats_score,
      skills:   mlResult.skills   ?? [],
      gaps:     mlResult.gaps     ?? [],
      insights: mlResult.insights ?? [],
    });

    return mlResult;
  },

  /**
   * Fetch job recommendations from the ML API for a given resume.
   *
   * @param {number} resumeId
   * @param {object} filters  - { type, location, experience }
   * @returns {Array}         - array of job objects
   */
  async getJobMatches(resumeId, filters = {}) {
    try {
      const { data } = await axios.post(`${ML_API}/jobs/recommend`, {
        resume_id: resumeId,
        ...filters,
      });
      return Array.isArray(data) ? data : data.jobs ?? [];
    } catch (err) {
      if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
        return resumeService._mockJobs();
      }
      throw err;
    }
  },

  /**
   * Retrieve a single resume + its analysis (ownership-checked).
   */
  async getById(resumeId, userId) {
    const resume = await Resume.findById(resumeId, userId);
    if (!resume) {
      const err = new Error("Resume not found.");
      err.status = 404;
      throw err;
    }
    return resume;
  },

  /**
   * Retrieve upload history for a user.
   */
  async getHistory(userId) {
    return Resume.findByUser(userId);
  },

  /**
   * Delete a resume — returns the stored filename for disk cleanup.
   */
  async remove(resumeId, userId) {
    const storedName = await Resume.delete(resumeId, userId);
    if (!storedName) {
      const err = new Error("Resume not found.");
      err.status = 404;
      throw err;
    }
    return storedName;
  },

  // ── Mock helpers (used when ML API is offline in development) ────────────────

  _mockAnalysis(resumeId) {
    return {
      resume_id: resumeId,
      ats_score: 87,
      skills: [
        { name: "React",      level: 92 },
        { name: "TypeScript", level: 85 },
        { name: "Node.js",    level: 78 },
        { name: "Python",     level: 64 },
        { name: "SQL",        level: 72 },
      ],
      gaps:     ["Docker", "AWS", "Kubernetes"],
      insights: [
        { type: "critical",   text: "Add quantifiable achievements to bullet points." },
        { type: "suggestion", text: "Expand DevOps skills — Docker and AWS appear in 70% of matched roles." },
        { type: "positive",   text: "Keyword density is in the top 15% of applicants." },
      ],
      job_matches: resumeService._mockJobs(),
    };
  },

  _mockJobs() {
    return [
      { id: 1,  title: "Senior Frontend Engineer", company: "Stripe",   location: "Remote",        type: "Full-time", match: 97, salary: "$140–180k" },
      { id: 2,  title: "Full Stack Developer",      company: "Notion",   location: "San Francisco", type: "Full-time", match: 91, salary: "$130–160k" },
      { id: 3,  title: "React Engineer",             company: "Figma",    location: "New York",      type: "Full-time", match: 88, salary: "$125–155k" },
      { id: 4,  title: "Software Engineer II",       company: "Vercel",   location: "Remote",        type: "Full-time", match: 85, salary: "$120–150k" },
      { id: 5,  title: "TypeScript Engineer",        company: "Supabase", location: "Remote",        type: "Contract",  match: 79, salary: "$100–130k" },
    ];
  },
};

module.exports = resumeService;
