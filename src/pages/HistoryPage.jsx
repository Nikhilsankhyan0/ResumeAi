import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Upload, FileSearch, ArrowRight, Trash2, Eye, TrendingUp, CheckCircle2 } from "lucide-react";
import { selectResume, selectAuth, clearHistory, setAnalysisResult } from "../store/index.js";

function ScoreBadge({ score }) {
  const color = score >= 80 ? "#10b981" : score >= 65 ? "#6366f1" : score >= 45 ? "#f59e0b" : "#f43f5e";
  const label = score >= 80 ? "Excellent" : score >= 65 ? "Good" : score >= 45 ? "Fair" : "Poor";
  return (
    <span className="text-xs font-display font-700 px-2.5 py-1 rounded-full"
      style={{ color, background:`${color}18`, border:`1px solid ${color}30` }}>
      {label} · {score}
    </span>
  );
}

export default function HistoryPage() {
  const navigate        = useNavigate();
  const dispatch        = useDispatch();
  const { history }     = useSelector(selectResume);
  const { user }        = useSelector(selectAuth);
  const userId          = user?.id;
  const [confirmClear, setConfirmClear] = useState(false);

  const avgScore  = history.length ? Math.round(history.reduce((s,e) => s+(e.result?.ats_score??0),0)/history.length) : 0;
  const bestScore = history.length ? Math.max(...history.map(e => e.result?.ats_score??0)) : 0;

  function viewEntry(entry) {
    dispatch(setAnalysisResult(entry.result));
    navigate("/results");
  }

  function handleClearAll() {
    if (confirmClear) { dispatch(clearHistory(userId)); setConfirmClear(false); }
    else { setConfirmClear(true); setTimeout(() => setConfirmClear(false), 3000); }
  }

  return (
    <div className="flex flex-col gap-7">
      {/* Header */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:.4 }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-800 text-2xl" style={{ color:"var(--text-primary)" }}>Analysis History</h1>
            <p className="text-sm mt-1 font-body" style={{ color:"var(--text-muted)" }}>
              {history.length} saved {history.length === 1 ? "analysis" : "analyses"} for {user?.name ?? "you"}
            </p>
          </div>
          {history.length > 0 && (
            <button onClick={handleClearAll}
              className={`flex items-center gap-2 text-sm px-4 py-2 rounded-xl transition-all duration-200 border ${
                confirmClear ? "bg-rose-500/15 border-rose-500/30 text-rose-300" : "border-transparent hover:text-rose-400 hover:bg-rose-500/08"
              }`} style={{ color: confirmClear ? undefined : "rgba(255,255,255,.4)" }}>
              <Trash2 size={14}/>{confirmClear ? "Click again to confirm" : "Clear History"}
            </button>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      {history.length > 0 && (
        <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1 }}
          className="grid grid-cols-3 gap-4">
          {[
            { icon:FileSearch,   label:"Total Analyses", value:history.length, color:"#6366f1" },
            { icon:TrendingUp,   label:"Average Score",  value:avgScore,       color:"#10b981" },
            { icon:CheckCircle2, label:"Best Score",     value:bestScore,      color:"#f59e0b" },
          ].map(({ icon:Icon, label, value, color }) => (
            <div key={label} className="glass-card rounded-xl p-4 flex flex-col items-center gap-1.5">
              <Icon size={18} style={{ color }}/>
              <span className="font-display font-800 text-xl" style={{ color:"var(--text-primary)" }}>{value}</span>
              <span className="text-xs font-body text-center" style={{ color:"var(--text-muted)" }}>{label}</span>
            </div>
          ))}
        </motion.div>
      )}

      {/* Empty state */}
      {history.length === 0 ? (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.2 }}
          className="flex flex-col items-center justify-center py-24 gap-5 text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background:"rgba(99,102,241,.08)", border:"1px solid rgba(99,102,241,.15)" }}>
            <Clock size={32} className="text-indigo-400"/>
          </div>
          <div>
            <h3 className="font-display font-700 text-xl mb-2" style={{ color:"var(--text-primary)" }}>No history yet</h3>
            <p className="text-sm font-body max-w-xs" style={{ color:"var(--text-muted)" }}>
              Your resume analyses will be saved here automatically — only for your account.
            </p>
          </div>
          <button onClick={() => navigate("/analyze")} className="btn-primary flex items-center gap-2 text-sm px-6 py-3">
            <Upload size={14}/> Analyze Your First Resume <ArrowRight size={13}/>
          </button>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {history.map((entry, i) => {
              const score   = entry.result?.ats_score ?? 0;
              const skills  = entry.result?.skills ?? [];
              const missing = entry.result?.missing_skills ?? entry.result?.gaps ?? [];
              return (
                <motion.div key={entry.id}
                  initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                  transition={{ duration:.3, delay: i * .04 }}
                  className="group glass-card rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer"
                  onClick={() => viewEntry(entry)}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background:"rgba(99,102,241,.1)", border:"1px solid rgba(99,102,241,.2)" }}>
                    <FileSearch size={18} className="text-indigo-400"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-display font-700 group-hover:text-indigo-400 transition-colors" style={{ color:"var(--text-primary)" }}>
                        {entry.fileName ?? `Analysis #${history.length - i}`}
                      </p>
                      <ScoreBadge score={score}/>
                    </div>
                    <p className="text-xs font-body mt-1" style={{ color:"var(--text-muted)" }}>
                      {new Date(entry.date).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric"})}
                      {" · "}{skills.length} skills{missing.length > 0 && ` · ${missing.length} gaps`}
                    </p>
                  </div>
                  <div className="hidden md:flex flex-wrap gap-1.5 max-w-xs">
                    {skills.slice(0,4).map(s => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-md font-body"
                        style={{ background:"rgba(99,102,241,.1)", color:"var(--text-muted)", border:"1px solid rgba(99,102,241,.15)" }}>
                        {s}
                      </span>
                    ))}
                    {skills.length > 4 && <span className="text-[10px]" style={{ color:"var(--text-subtle)" }}>+{skills.length-4}</span>}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="flex items-center gap-1.5 text-xs font-body opacity-0 group-hover:opacity-100 transition-opacity" style={{ color:"#6366f1" }}>
                      <Eye size={13}/> View
                    </span>
                    <ArrowRight size={14} className="text-white/20 group-hover:text-indigo-400 transition-colors"/>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
