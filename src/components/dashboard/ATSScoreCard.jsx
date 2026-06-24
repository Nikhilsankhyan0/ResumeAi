import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, AlertCircle, CheckCircle2, Info } from "lucide-react";

const CRITERIA = [
  { label: "Keyword Match",   score: 91, color: "#6366f1" },
  { label: "Formatting",      score: 85, color: "#8b5cf6" },
  { label: "Impact Language", score: 78, color: "#3b82f6" },
  { label: "Section Coverage",score: 94, color: "#10b981" },
  { label: "Readability",     score: 82, color: "#a78bfa" },
];

function ScoreRing({ score }) {
  const r          = 52;
  const circ       = 2 * Math.PI * r;
  const dashOffset = circ * (1 - score / 100);

  const color =
    score >= 85 ? "#10b981" :
    score >= 70 ? "#6366f1" :
    score >= 50 ? "#f59e0b" : "#f43f5e";

  const label =
    score >= 85 ? "Excellent" :
    score >= 70 ? "Good"      :
    score >= 50 ? "Fair"      : "Poor";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r={r} fill="none"
            stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <motion.circle
            cx="60" cy="60" r={r} fill="none"
            stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-800 text-4xl text-white leading-none">{score}</span>
          <span className="text-xs text-white/45 font-body mt-0.5">/ 100</span>
        </div>
      </div>
      <span
        className="px-3 py-1 rounded-full text-xs font-display font-700"
        style={{
          color,
          background: `${color}18`,
          border: `1px solid ${color}35`,
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function ATSScoreCard({ score = 87 }) {
  return (
    <div
      className="relative rounded-2xl p-6 flex flex-col gap-6 overflow-hidden"
      style={{
        background: "rgba(10,10,26,0.75)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.5),transparent)" }} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-700 text-white text-base">ATS Score</h3>
          <p className="text-xs text-white/40 font-body mt-0.5">Applicant Tracking System</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-body">
          <TrendingUp size={13} />
          <span>+12 this week</span>
        </div>
      </div>

      {/* Score ring + criteria — side by side on md+ */}
      <div className="flex flex-col sm:flex-row items-center gap-8">
        <ScoreRing score={score} />

        {/* Criteria bars */}
        <div className="flex flex-col gap-3 flex-1 w-full">
          {CRITERIA.map((c, i) => (
            <div key={c.label} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/55 font-body">{c.label}</span>
                <span className="text-xs font-display font-700" style={{ color: c.color }}>{c.score}%</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: c.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${c.score}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 + i * 0.08 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status pills */}
      <div className="grid grid-cols-3 gap-3 pt-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {[
          { icon: CheckCircle2, label: "ATS Ready",    color: "text-emerald-400", bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.18)"  },
          { icon: TrendingUp,   label: "Top 15%",      color: "text-indigo-400",  bg: "rgba(99,102,241,0.08)",  border: "rgba(99,102,241,0.18)"  },
          { icon: Info,         label: "2 Suggestions",color: "text-amber-400",   bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.18)"  },
        ].map(({ icon: Icon, label, color, bg, border }) => (
          <div key={label}
            className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl ${color} text-center`}
            style={{ background: bg, border: `1px solid ${border}` }}>
            <Icon size={14} />
            <span className="text-[10px] font-display font-600 leading-tight">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
