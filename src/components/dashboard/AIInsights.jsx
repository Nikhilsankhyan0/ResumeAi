import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, ChevronDown, ChevronUp,
  AlertTriangle, CheckCircle2, Lightbulb, Zap,
} from "lucide-react";

const INSIGHTS = [
  {
    id: 1,
    type: "critical",
    icon: AlertTriangle,
    title: "Add quantifiable achievements",
    body: "Your experience bullets lack numbers. Try: \"Increased performance by 40%\" instead of \"Improved performance\". Recruiters scan for metrics.",
    action: "Fix with AI",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.18)",
  },
  {
    id: 2,
    type: "suggestion",
    icon: Lightbulb,
    title: "Expand your skills section",
    body: "Top job matches require Docker and AWS experience. Adding these with even basic proficiency could boost your match rate by ~18%.",
    action: "View gaps",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.18)",
  },
  {
    id: 3,
    type: "positive",
    icon: CheckCircle2,
    title: "Strong keyword density",
    body: "Your resume contains 91% of the high-frequency keywords found in your target roles. This puts you well above the 70% threshold for most ATS filters.",
    action: null,
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.18)",
  },
  {
    id: 4,
    type: "suggestion",
    icon: Zap,
    title: "Rewrite your summary",
    body: "Your current summary is generic. A tailored, role-specific summary can improve interview callbacks by up to 3×. Our AI can rewrite it in one click.",
    action: "Rewrite now",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.08)",
    border: "rgba(99,102,241,0.18)",
  },
];

function InsightRow({ insight, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const Icon = insight.icon;

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: open ? insight.bg : "rgba(255,255,255,0.02)",
        border: `1px solid ${open ? insight.border : "rgba(255,255,255,0.06)"}`,
      }}
    >
      {/* Row header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: insight.bg, border: `1px solid ${insight.border}` }}
        >
          <Icon size={15} style={{ color: insight.color }} />
        </div>
        <span className="flex-1 text-sm font-display font-600 text-white leading-snug">
          {insight.title}
        </span>
        <span className="flex-shrink-0 text-white/30">
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>

      {/* Expandable body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 flex flex-col gap-3"
              style={{ paddingLeft: "3.75rem" }}>
              <p className="text-sm text-white/55 leading-relaxed font-body">
                {insight.body}
              </p>
              {insight.action && (
                <button
                  className="w-fit text-xs font-display font-700 px-3 py-1.5 rounded-lg transition-all duration-200 hover:opacity-90"
                  style={{
                    color: insight.color,
                    background: insight.bg,
                    border: `1px solid ${insight.border}`,
                  }}
                >
                  {insight.action} →
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AIInsights() {
  const criticalCount    = INSIGHTS.filter(i => i.type === "critical").length;
  const suggestionCount  = INSIGHTS.filter(i => i.type === "suggestion").length;

  return (
    <div
      className="relative rounded-2xl p-6 flex flex-col gap-5 overflow-hidden"
      style={{
        background: "rgba(10,10,26,0.75)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Top accent */}
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.5),transparent)" }} />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.22)" }}
          >
            <Sparkles size={15} className="text-indigo-400" />
          </div>
          <div>
            <h3 className="font-display font-700 text-white text-base">AI Insights</h3>
            <p className="text-xs text-white/40 font-body">Personalized recommendations</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="text-xs font-display font-600 px-2.5 py-0.5 rounded-full text-amber-300"
              style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
              {criticalCount} Critical
            </span>
          )}
          <span className="text-xs font-display font-600 px-2.5 py-0.5 rounded-full text-violet-300"
            style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
            {suggestionCount} Tips
          </span>
        </div>
      </div>

      {/* Insight rows */}
      <div className="flex flex-col gap-2">
        {INSIGHTS.map((insight, i) => (
          <InsightRow key={insight.id} insight={insight} defaultOpen={i === 0} />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-xs text-white/30 font-body">Updated just now</p>
        <button className="text-xs font-display font-600 text-indigo-400 hover:text-indigo-300 transition-colors">
          Refresh analysis →
        </button>
      </div>
    </div>
  );
}
