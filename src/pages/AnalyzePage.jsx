import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileSearch, Sparkles, FileText, Target } from "lucide-react";
import ResumeUploader from "../components/upload/ResumeUploader.jsx";

export default function AnalyzePage() {
  const [jdText, setJdText] = useState("");
  const [jdOpen, setJdOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-3 mb-1.5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.22)" }}>
            <FileSearch size={20} className="text-indigo-400" />
          </div>
          <h1 className="font-display font-800 text-2xl" style={{ color: "var(--text-primary)" }}>Analyze Resume</h1>
        </div>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Upload your resume to get an instant ATS score, skill gap analysis, and personalized job matches.
        </p>
      </motion.div>

      {/* Upload card */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}
        className="relative rounded-2xl p-6 glass-card overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px"
          style={{ background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.5),transparent)" }} />

        <div className="flex items-center gap-2 mb-5">
          <FileText size={16} className="text-indigo-400" />
          <span className="font-display font-700 text-sm" style={{ color: "var(--text-primary)" }}>Resume File</span>
          <span className="badge-rose badge text-[10px] ml-auto">Required</span>
        </div>

        <ResumeUploader jdText={jdText} />
      </motion.div>

      {/* Optional JD */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.18 }}>
        <button
          onClick={() => setJdOpen(!jdOpen)}
          className="w-full flex items-center gap-3 rounded-2xl px-5 py-4 transition-all duration-200 text-left glass-card">
          <Target size={17} className="text-violet-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-display font-700 text-sm" style={{ color: "var(--text-primary)" }}>
              Add Job Description <span className="badge-violet badge text-[10px] ml-2">Optional</span>
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              Paste a JD to get a targeted ATS score for that specific role
            </p>
          </div>
          <motion.div animate={{ rotate: jdOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)" }} />
            </svg>
          </motion.div>
        </button>

        <AnimateSection open={jdOpen}>
          <div className="mt-2 rounded-2xl p-4 glass-card">
            <textarea
              value={jdText}
              onChange={e => setJdText(e.target.value)}
              placeholder="Paste the job description here… The AI will compare your resume against these requirements."
              rows={6}
              className="input-glass text-sm resize-none"
              style={{ fontFamily: "Inter, sans-serif" }}
            />
            {jdText && (
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs" style={{ color: "var(--text-subtle)" }}>{jdText.length} characters</span>
                <button onClick={() => setJdText("")} className="text-xs hover:text-rose-400 transition-colors" style={{ color: "var(--text-subtle)" }}>Clear</button>
              </div>
            )}
          </div>
        </AnimateSection>
      </motion.div>

      {/* Feature cards */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: "⚡", label: "Instant Results",  sub: "Score in under 60 seconds",  color: "rgba(99,102,241,0.08)"  },
          { icon: "🎯", label: "ATS Optimized",    sub: "Beat applicant tracking",     color: "rgba(139,92,246,0.08)"  },
          { icon: "🤖", label: "AI-Powered",        sub: "ML-based skill gap analysis", color: "rgba(59,130,246,0.08)"  },
        ].map(({ icon, label, sub, color }) => (
          <div key={label} className="flex items-center gap-3 rounded-xl px-4 py-3.5 glass-card">
            <span className="text-xl">{icon}</span>
            <div>
              <p className="text-sm font-display font-700" style={{ color: "var(--text-primary)" }}>{label}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{sub}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function AnimateSection({ open, children }) {
  return (
    <motion.div
      initial={false}
      animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="overflow-hidden">
      {children}
    </motion.div>
  );
}
