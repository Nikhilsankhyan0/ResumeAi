import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, BriefcaseBusiness, FileSearch, TrendingUp, ArrowRight, Sparkles, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { selectAuth, selectResume, selectJobs, setAnalysisResult } from "../store/index.js";
import { useDispatch } from "react-redux";

function StatCard({ icon:Icon, label, value, color, bg, border, onClick }) {
  return (
    <motion.div whileHover={{ y:-2 }} transition={{ type:"spring", stiffness:400, damping:20 }}
      onClick={onClick}
      className={`glass-card rounded-2xl px-5 py-4 flex items-center gap-4 ${onClick ? "cursor-pointer" : ""}`}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background:bg, border:`1px solid ${border}` }}>
        <Icon size={20} style={{ color }}/>
      </div>
      <div>
        <p className="font-display font-800 text-2xl leading-none" style={{ color:"var(--text-primary)" }}>{value}</p>
        <p className="text-xs font-body mt-1" style={{ color:"var(--text-muted)" }}>{label}</p>
      </div>
    </motion.div>
  );
}

function InsightChip({ insight }) {
  const cfg = {
    positive:   { icon:CheckCircle2, color:"#10b981", bg:"rgba(16,185,129,.08)",  border:"rgba(16,185,129,.2)"  },
    critical:   { icon:AlertCircle,  color:"#f43f5e", bg:"rgba(244,63,94,.08)",   border:"rgba(244,63,94,.2)"   },
    suggestion: { icon:Sparkles,     color:"#8b5cf6", bg:"rgba(139,92,246,.08)",  border:"rgba(139,92,246,.2)"  },
  }[insight.type] ?? { icon:Sparkles, color:"#6366f1", bg:"rgba(99,102,241,.08)", border:"rgba(99,102,241,.2)" };
  const Ic = cfg.icon;
  return (
    <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl"
      style={{ background:cfg.bg, border:`1px solid ${cfg.border}` }}>
      <Ic size={14} className="flex-shrink-0 mt-0.5" style={{ color:cfg.color }}/>
      <p className="text-sm font-body leading-relaxed" style={{ color:"var(--text-primary)" }}>{insight.text}</p>
    </div>
  );
}

export default function Dashboard() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { user }  = useSelector(selectAuth);
  const { analysisResult, history } = useSelector(selectResume);
  const { savedJobs } = useSelector(selectJobs);

  const firstName = user?.name?.split(" ")[0] ?? "there";
  const score     = analysisResult?.ats_score ?? null;
  const skills    = analysisResult?.skills ?? [];
  const missing   = analysisResult?.missing_skills ?? analysisResult?.gaps ?? [];
  const insights  = analysisResult?.insights ?? [];
  const jobCount  = analysisResult?.job_listings?.length ?? 0;

  return (
    <div className="flex flex-col gap-7">
      {/* Welcome */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:.4 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-800 text-2xl" style={{ color:"var(--text-primary)" }}>Welcome back, {firstName} 👋</h1>
            <p className="text-sm mt-1 font-body" style={{ color:"var(--text-muted)" }}>
              {analysisResult
                ? `Last analyzed: ${history[0] ? new Date(history[0].date).toLocaleDateString() : "just now"}`
                : "Upload your resume to get started."}
            </p>
          </div>
          <button onClick={() => navigate("/analyze")} className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2 w-fit">
            <Upload size={14}/>{analysisResult ? "New Analysis" : "Analyze Resume"}<ArrowRight size={13}/>
          </button>
        </div>
      </motion.div>

      {/* Upload nudge */}
      {!analysisResult && (
        <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1 }}
          className="relative glass-card rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px"
            style={{ background:"linear-gradient(90deg,transparent,rgba(99,102,241,.6),transparent)" }}/>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background:"rgba(99,102,241,.15)", border:"1px solid rgba(99,102,241,.25)" }}>
              <Upload size={18} className="text-indigo-400"/>
            </div>
            <div>
              <p className="font-display font-700 text-sm" style={{ color:"var(--text-primary)" }}>Upload your resume to get started</p>
              <p className="text-xs mt-0.5 font-body" style={{ color:"var(--text-muted)" }}>Get your ATS score, skill gaps, and job matches in under 60 seconds.</p>
            </div>
          </div>
          <button onClick={() => navigate("/analyze")} className="btn-primary text-sm px-5 py-2 flex items-center gap-2 flex-shrink-0">
            Upload Now <ArrowRight size={13}/>
          </button>
        </motion.div>
      )}

      {/* Stats */}
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileSearch}       label="ATS Score"      value={score !== null ? `${score}` : "—"} color="#6366f1" bg="rgba(99,102,241,.08)"  border="rgba(99,102,241,.18)" onClick={score !== null ? () => navigate("/results") : undefined}/>
        <StatCard icon={BriefcaseBusiness} label="Job Matches"   value={jobCount || "—"}                   color="#8b5cf6" bg="rgba(139,92,246,.08)"  border="rgba(139,92,246,.18)" onClick={jobCount ? () => navigate("/jobs") : undefined}/>
        <StatCard icon={TrendingUp}        label="Skills Found"  value={skills.length || "—"}              color="#10b981" bg="rgba(16,185,129,.08)"  border="rgba(16,185,129,.18)" onClick={undefined}/>
        <StatCard icon={Clock}             label="Past Analyses" value={history.length}                    color="#f59e0b" bg="rgba(245,158,11,.08)"  border="rgba(245,158,11,.18)" onClick={() => navigate("/history")}/>
      </motion.div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* AI Insights */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.18 }}>
          <div className="glass-card rounded-2xl p-5 h-full relative overflow-hidden flex flex-col gap-4">
            <div className="absolute top-0 inset-x-0 h-px"
              style={{ background:"linear-gradient(90deg,transparent,rgba(99,102,241,.4),transparent)" }}/>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background:"rgba(99,102,241,.12)", border:"1px solid rgba(99,102,241,.22)" }}>
                  <Sparkles size={14} className="text-indigo-400"/>
                </div>
                <h3 className="font-display font-700 text-base" style={{ color:"var(--text-primary)" }}>AI Insights</h3>
              </div>
              {analysisResult && (
                <button onClick={() => navigate("/results")} className="text-xs font-body text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                  See full report <ArrowRight size={11}/>
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2.5 flex-1">
              {insights.length > 0
                ? insights.slice(0,4).map((ins,i) => <InsightChip key={i} insight={ins}/>)
                : (
                  <div className="flex flex-col items-center justify-center flex-1 py-8 gap-3 text-center">
                    <Sparkles size={28} style={{ color:"var(--text-subtle)" }}/>
                    <p className="text-sm font-body" style={{ color:"var(--text-muted)" }}>Upload your resume to get AI-powered insights</p>
                    <button onClick={() => navigate("/analyze")} className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5">
                      Get Started <ArrowRight size={11}/>
                    </button>
                  </div>
                )
              }
            </div>
          </div>
        </motion.div>

        {/* Skills + History */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.22 }}
          className="flex flex-col gap-5">

          {/* Skills overview */}
          <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px"
              style={{ background:"linear-gradient(90deg,transparent,rgba(16,185,129,.4),transparent)" }}/>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-700 text-sm" style={{ color:"var(--text-primary)" }}>Skills Overview</h3>
              {missing.length > 0 && (
                <span className="text-[10px] font-display font-600 px-2 py-0.5 rounded-full text-amber-300"
                  style={{ background:"rgba(245,158,11,.1)", border:"1px solid rgba(245,158,11,.2)" }}>
                  {missing.length} gaps
                </span>
              )}
            </div>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.slice(0,10).map(s => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-lg font-body"
                    style={{ background:"rgba(16,185,129,.08)", border:"1px solid rgba(16,185,129,.18)", color:"#6ee7b7" }}>{s}</span>
                ))}
                {skills.length > 10 && <span className="text-xs px-2.5 py-1 rounded-lg font-body" style={{ color:"var(--text-subtle)" }}>+{skills.length-10} more</span>}
              </div>
            ) : (
              <p className="text-sm font-body py-3 text-center" style={{ color:"var(--text-subtle)" }}>No skills detected yet</p>
            )}
          </div>

          {/* Recent history */}
          <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px"
              style={{ background:"linear-gradient(90deg,transparent,rgba(59,130,246,.4),transparent)" }}/>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-700 text-sm" style={{ color:"var(--text-primary)" }}>Recent Analyses</h3>
              <button onClick={() => navigate("/history")} className="text-xs font-body text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                View all <ArrowRight size={11}/>
              </button>
            </div>
            {history.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {history.slice(0,3).map(entry => {
                  const s = entry.result?.ats_score ?? 0;
                  const c = s >= 80 ? "#10b981" : s >= 65 ? "#6366f1" : "#f59e0b";
                  return (
                    <div key={entry.id}
                      className="flex items-center gap-3 py-2 px-3 rounded-xl cursor-pointer hover:bg-white/03 transition-colors"
                      onClick={() => { dispatch(setAnalysisResult(entry.result)); navigate("/results"); }}>
                      <FileSearch size={14} className="text-indigo-400 flex-shrink-0"/>
                      <span className="text-sm font-body flex-1 truncate" style={{ color:"var(--text-primary)" }}>{entry.fileName ?? "Resume"}</span>
                      <span className="text-xs font-display font-700 flex-shrink-0" style={{ color:c }}>{s}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm font-body py-2 text-center" style={{ color:"var(--text-subtle)" }}>No history yet</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom CTA */}
      {analysisResult && (
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.32 }}
          className="relative glass-card rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px"
            style={{ background:"linear-gradient(90deg,transparent,rgba(139,92,246,.4),transparent)" }}/>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background:"rgba(139,92,246,.12)", border:"1px solid rgba(139,92,246,.22)" }}>
              <BriefcaseBusiness size={18} className="text-violet-400"/>
            </div>
            <div>
              <p className="font-display font-700 text-sm" style={{ color:"var(--text-primary)" }}>{jobCount} jobs match your profile</p>
              <p className="text-xs mt-0.5 font-body" style={{ color:"var(--text-muted)" }}>AI-ranked opportunities at top companies.</p>
            </div>
          </div>
          <button onClick={() => navigate("/jobs")} className="btn-secondary text-sm px-5 py-2 flex items-center gap-2 flex-shrink-0">
            Browse Matches <ArrowRight size={13}/>
          </button>
        </motion.div>
      )}
    </div>
  );
}
