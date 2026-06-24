const { spawn } = require("child_process");
const path      = require("path");

const ML_DIR = path.join(__dirname, "..", "ml");
const PYTHON  = process.env.PYTHON_BIN || "python3";
const TIMEOUT = 45_000; // 45 s

function runPython(script, payload) {
  return new Promise((resolve, reject) => {
    const child  = spawn(PYTHON, [path.join(ML_DIR, script)]);
    let stdout   = "";
    let stderr   = "";

    child.stdout.on("data", d => { stdout += d.toString(); });
    child.stderr.on("data", d => { stderr += d.toString(); });

    const timer = setTimeout(() => {
      child.kill();
      reject(new Error(`ML timeout (${TIMEOUT/1000}s): ${script}`));
    }, TIMEOUT);

    child.on("close", code => {
      clearTimeout(timer);
      if (code !== 0)
        return reject(new Error(`${script} exited ${code}: ${stderr.slice(0,300)}`));
      const raw = stdout.trim();
      if (!raw)
        return reject(new Error(`${script} produced no output`));
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error(`${script} returned invalid JSON: ${raw.slice(0,200)}`));
      }
    });

    child.on("error", err => {
      clearTimeout(timer);
      reject(new Error(`Cannot start Python (${PYTHON}): ${err.message}`));
    });

    if (payload !== undefined) child.stdin.write(JSON.stringify(payload));
    child.stdin.end();
  });
}

async function parseResume(filePath) {
  return runPython("parser.py", { file_path: filePath });
}

async function calculateATS(resumeData, jdText = "") {
  return runPython("ats.py", { resume: resumeData, jd: jdText });
}

async function getRecommendations(skills = [], targetRole = null, topN = 5, detectedRole = null) {
  return runPython("recommender.py", { skills, target_role: targetRole, top_n: topN, detected_role: detectedRole });
}

async function analyzeResume(filePath, jdText = "", targetRole = null) {
  const parsed = await parseResume(filePath);
  if (parsed.error) throw new Error(`Parser: ${parsed.error}`);

  const [ats, rec] = await Promise.all([
    calculateATS(parsed, jdText),
    getRecommendations(parsed.skills, targetRole, 5, parsed.detected_role),
  ]);

  return {
    name:             parsed.name,
    email:            parsed.email,
    phone:            parsed.phone,
    education:        parsed.education,
    experience_years: parsed.experience_years,
    skills:           parsed.skills,
    detected_role:    parsed.detected_role,
    ats_score:        ats.ats_score,
    ats_category:     ats.ats_category,
    ats_breakdown:    ats.breakdown,
    matched_skills:   ats.matched_skills ?? rec.matched_skills,
    missing_skills:   ats.missing_skills  ?? rec.missing_skills,
    recommended_roles:rec.recommended_roles,
    job_listings:     rec.job_listings,
    insights:         _buildInsights(ats, rec, parsed),
  };
}

function _buildInsights(ats, rec, parsed) {
  const list = [];
  if (ats.ats_score >= 80)
    list.push({ type:"positive",   text:`Strong ATS score of ${ats.ats_score} — you're in the top tier.` });
  else if (ats.ats_score < 55)
    list.push({ type:"critical",   text:`ATS score of ${ats.ats_score} is below average — add more job keywords.` });
  else
    list.push({ type:"suggestion", text:`ATS score of ${ats.ats_score} is good. Small tweaks can push it higher.` });

  const missing = (ats.missing_skills ?? []).slice(0,3);
  if (missing.length > 0)
    list.push({ type:"suggestion", text:`Adding ${missing.join(", ")} could boost your match rate by +${missing.length*6}%.` });

  if ((parsed.skills || []).length < 5)
    list.push({ type:"critical",   text:"Very few skills detected. Expand your skills section." });
  else if ((parsed.skills || []).length >= 10)
    list.push({ type:"positive",   text:"Strong keyword coverage — your resume is well optimised." });

  if (parsed.experience_years === 0)
    list.push({ type:"suggestion", text:"Quantify your experience years (e.g. '3 years of experience')." });

  return list;
}

module.exports = { parseResume, calculateATS, getRecommendations, analyzeResume };
