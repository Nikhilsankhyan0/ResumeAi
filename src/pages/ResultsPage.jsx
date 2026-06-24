import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Upload, BriefcaseBusiness, TrendingUp, CheckCircle2, AlertCircle, Lightbulb, Target, Award, BookOpen } from "lucide-react";
import { selectResume } from "../store/index.js";

function ATSRing({ score = 0 }) {
  const r    = 52;
  const circ = 2 * Math.PI * r;
  const pct  = Math.min(score, 100) / 100;
  const color = score >= 80 ? "#10b981" : score >= 65 ? "#6366f1" : score >= 45 ? "#f59e0b" : "#f43f5e";
  const label = score >= 80 ? "Excellent" : score >= 65 ? "Good" : score >= 45 ? "Fair" : "Needs Work";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9"/>
          <motion.circle cx="60" cy="60" r={r} fill="none"
            stroke={color} strokeWidth="9" strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset:circ }}
            animate={{ strokeDashoffset: circ * (1 - pct) }}
            transition={{ duration:1.6, ease:"easeOut", delay:.3 }}/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span initial={{ opacity:0, scale:.5 }} animate={{ opacity:1, scale:1 }}
            transition={{ delay:.8, type:"spring" }}
            className="font-display font-800 text-4xl leading-none" style={{ color:"var(--text-primary)" }}>
            {score}
          </motion.span>
          <span className="text-xs font-body" style={{ color:"var(--text-muted)" }}>/100</span>
        </div>
      </div>
      <motion.span initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1 }}
        className="px-3 py-1 rounded-full text-xs font-display font-700"
        style={{ color, background:`${color}18`, border:`1px solid ${color}35` }}>
        {label}
      </motion.span>
    </div>
  );
}

function Bar({ label, value, color, delay=0 }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-body" style={{ color:"var(--text-muted)" }}>{label}</span>
        <span className="text-xs font-display font-700" style={{ color }}>{Math.round(value)}%</span>
      </div>
      <div className="h-2 rounded-full" style={{ background:"rgba(255,255,255,.06)" }}>
        <motion.div className="h-full rounded-full" style={{ background:color }}
          initial={{ width:0 }} animate={{ width:`${value}%` }}
          transition={{ duration:1, ease:"easeOut", delay }}/>
      </div>
    </div>
  );
}

function Pill({ skill, type }) {
  const s = {
    matched:{ color:"#10b981", bg:"rgba(16,185,129,.1)",  border:"rgba(16,185,129,.25)", icon:<CheckCircle2 size={11}/> },
    missing:{ color:"#f59e0b", bg:"rgba(245,158,11,.1)",  border:"rgba(245,158,11,.25)", icon:<AlertCircle  size={11}/> },
    keyword:{ color:"#3b82f6", bg:"rgba(59,130,246,.1)",  border:"rgba(59,130,246,.2)",  icon:<BookOpen     size={11}/> },
    strong: { color:"#6366f1", bg:"rgba(99,102,241,.1)",  border:"rgba(99,102,241,.25)", icon:<Award        size={11}/> },
  }[type] || { color:"#6366f1", bg:"rgba(99,102,241,.1)", border:"rgba(99,102,241,.25)", icon:<Award size={11}/> };
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-body font-500"
      style={{ color:s.color, background:s.bg, border:`1px solid ${s.border}` }}>
      {s.icon}{skill}
    </span>
  );
}

function InsightRow({ insight, index }) {
  const cfg = {
    positive:   { icon:CheckCircle2, color:"#10b981", bg:"rgba(16,185,129,.08)",  border:"rgba(16,185,129,.18)" },
    critical:   { icon:AlertCircle,  color:"#f43f5e", bg:"rgba(244,63,94,.08)",   border:"rgba(244,63,94,.18)"  },
    suggestion: { icon:Lightbulb,    color:"#8b5cf6", bg:"rgba(139,92,246,.08)",  border:"rgba(139,92,246,.18)" },
  }[insight.type] ?? { icon:Lightbulb, color:"#6366f1", bg:"rgba(99,102,241,.08)", border:"rgba(99,102,241,.18)" };
  const Icon = cfg.icon;
  return (
    <motion.div initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
      transition={{ delay: index * .08 }}
      className="flex items-start gap-3 px-4 py-3 rounded-xl"
      style={{ background:cfg.bg, border:`1px solid ${cfg.border}` }}>
      <Icon size={15} className="flex-shrink-0 mt-0.5" style={{ color:cfg.color }}/>
      <p className="text-sm font-body leading-relaxed" style={{ color:"var(--text-primary)" }}>{insight.text}</p>
    </motion.div>
  );
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const { analysisResult, uploadedFile } = useSelector(selectResume);

  if (!analysisResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{ background:"rgba(99,102,241,.1)", border:"1px solid rgba(99,102,241,.2)" }}>
          <Upload size={32} className="text-indigo-400"/>
        </div>
        <div>
          <h2 className="font-display font-800 text-xl mb-2" style={{ color:"var(--text-primary)" }}>No results yet</h2>
          <p className="text-sm font-body" style={{ color:"var(--text-muted)" }}>Upload and analyze a resume to see your results.</p>
        </div>
        <button onClick={() => navigate("/analyze")} className="btn-primary flex items-center gap-2 text-sm px-6 py-3">
          Analyze Resume <ArrowRight size={14}/>
        </button>
      </div>
    );
  }

  const r         = analysisResult;
  const breakdown = r.ats_breakdown ?? {};
  const skills    = r.skills ?? [];
  const matched   = r.matched_skills ?? skills.slice(0,4);
  const missing   = (r.missing_skills ?? r.gaps ?? []).map(s => typeof s === "string" ? s : s.name);
  const insights  = r.insights ?? [];

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:.4 }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-800 text-2xl" style={{ color:"var(--text-primary)" }}>Analysis Results</h1>
            <p className="text-sm mt-1 font-body" style={{ color:"var(--text-muted)" }}>
              {uploadedFile?.name ?? "Your resume"} · {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => navigate("/jobs")} className="btn-secondary flex items-center gap-2 text-sm px-4 py-2">
              <BriefcaseBusiness size={14}/> Job Matches
            </button>
            <button onClick={() => navigate("/analyze")} className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
              <Upload size={14}/> New Analysis
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ATS Score */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1 }}>
          <div className="glass-card rounded-2xl p-6 flex flex-col gap-5 h-full relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px"
              style={{ background:"linear-gradient(90deg,transparent,rgba(99,102,241,.5),transparent)" }}/>
            <div>
              <h3 className="font-display font-700 text-base" style={{ color:"var(--text-primary)" }}>ATS Score</h3>
              <p className="text-xs font-body mt-0.5" style={{ color:"var(--text-muted)" }}>Applicant Tracking System</p>
            </div>
            <div className="flex justify-center"><ATSRing score={r.ats_score ?? 0}/></div>
            {Object.keys(breakdown).length > 0 && (
              <div className="flex flex-col gap-3">
                <p className="text-xs font-display font-700 uppercase tracking-wider" style={{ color:"var(--text-subtle)" }}>Breakdown</p>
                <Bar label="Keyword Match"  value={breakdown.tfidf_score     ?? 0} color="#6366f1" delay={.4}/>
                <Bar label="Semantic Match" value={breakdown.semantic_score   ?? 0} color="#8b5cf6" delay={.5}/>
                <Bar label="Skills"         value={breakdown.skill_score      ?? 0} color="#3b82f6" delay={.6}/>
                <Bar label="Experience"     value={breakdown.experience_score ?? 0} color="#10b981" delay={.7}/>
                <Bar label="Certifications" value={breakdown.certification_score??0} color="#f59e0b" delay={.8}/>
              </div>
            )}
          </div>
        </motion.div>

        {/* Skills column */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.15 }}
          className="flex flex-col gap-5">

          {/* Strong skills */}
          <div className="glass-card rounded-2xl p-5 flex-1 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px"
              style={{ background:"linear-gradient(90deg,transparent,rgba(16,185,129,.5),transparent)" }}/>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={15} className="text-emerald-400"/>
              <h3 className="font-display font-700 text-sm" style={{ color:"var(--text-primary)" }}>Strong Skills</h3>
              <span className="badge-emerald badge text-[10px] ml-auto">{matched.length > 0 ? matched.length : skills.length} found</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(matched.length > 0 ? matched : skills.slice(0,8)).map(s => (
                <Pill key={s} skill={s} type="matched"/>
              ))}
              {matched.length === 0 && skills.length === 0 && (
                <p className="text-xs font-body" style={{ color:"var(--text-subtle)" }}>No skills detected</p>
              )}
            </div>
          </div>

          {/* Missing skills */}
          <div className="glass-card rounded-2xl p-5 flex-1 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px"
              style={{ background:"linear-gradient(90deg,transparent,rgba(245,158,11,.5),transparent)" }}/>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={15} className="text-amber-400"/>
              <h3 className="font-display font-700 text-sm" style={{ color:"var(--text-primary)" }}>Missing Skills</h3>
              <span className="badge-amber badge text-[10px] ml-auto">{missing.length} gaps</span>
            </div>
            {missing.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-2">
                  {missing.map(s => <Pill key={s} skill={s} type="missing"/>)}
                </div>
                <p className="text-xs mt-3 font-body" style={{ color:"var(--text-muted)" }}>
                  Addressing these gaps could improve your match rate by{" "}
                  <span className="text-amber-400 font-display font-700">+{missing.length * 6}%</span>
                </p>
              </>
            ) : (
              <p className="text-xs font-body" style={{ color:"var(--text-muted)" }}>
                No critical skill gaps detected for this role! 🎉
              </p>
            )}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.2 }}>
          <div className="glass-card rounded-2xl p-5 flex flex-col gap-4 h-full relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px"
              style={{ background:"linear-gradient(90deg,transparent,rgba(139,92,246,.5),transparent)" }}/>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background:"rgba(99,102,241,.12)", border:"1px solid rgba(99,102,241,.22)" }}>
                <Target size={13} className="text-indigo-400"/>
              </div>
              <h3 className="font-display font-700 text-sm" style={{ color:"var(--text-primary)" }}>AI Insights</h3>
              <span className="badge-violet badge text-[10px] ml-auto">{insights.length} tips</span>
            </div>
            <div className="flex flex-col gap-2.5 flex-1">
              {insights.map((ins, i) => <InsightRow key={i} insight={ins} index={i}/>)}
            </div>
            <button onClick={() => navigate("/jobs")}
              className="btn-primary flex items-center justify-center gap-2 text-sm py-2.5 mt-2">
              <BriefcaseBusiness size={14}/> View Job Matches <ArrowRight size={13}/>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Keyword Analysis */}
      {skills.length > 0 && (
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.4 }}>
          <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px"
              style={{ background:"linear-gradient(90deg,transparent,rgba(59,130,246,.4),transparent)" }}/>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-blue-400"/>
              <h3 className="font-display font-700 text-sm" style={{ color:"var(--text-primary)" }}>Keyword Analysis</h3>
              <span className="badge-sky badge text-[10px] ml-auto">{skills.length} detected</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((s, i) => (
                <motion.span key={s} initial={{ opacity:0, scale:.8 }} animate={{ opacity:1, scale:1 }}
                  transition={{ delay:.5 + i * .03 }}
                  className="px-2.5 py-1 rounded-lg text-xs font-body"
                  style={{ background:"rgba(59,130,246,.08)", border:"1px solid rgba(59,130,246,.18)", color:"var(--text-primary)" }}>
                  {s}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
