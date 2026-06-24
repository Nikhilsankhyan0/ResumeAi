import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const SKILLS = [
  { name: "React",        level: 92, category: "Frontend",  trend: "up",   gap: false },
  { name: "TypeScript",   level: 85, category: "Frontend",  trend: "up",   gap: false },
  { name: "Node.js",      level: 78, category: "Backend",   trend: "same", gap: false },
  { name: "Python",       level: 65, category: "Backend",   trend: "down", gap: true  },
  { name: "SQL",          level: 72, category: "Database",  trend: "up",   gap: false },
  { name: "Docker",       level: 48, category: "DevOps",    trend: "down", gap: true  },
  { name: "AWS",          level: 55, category: "DevOps",    trend: "same", gap: true  },
  { name: "GraphQL",      level: 61, category: "API",       trend: "up",   gap: false },
];

const CATEGORIES = ["All", "Frontend", "Backend", "DevOps", "Database", "API"];

const CATEGORY_COLORS = {
  Frontend: "#6366f1",
  Backend:  "#8b5cf6",
  Database: "#3b82f6",
  DevOps:   "#f59e0b",
  API:      "#10b981",
};

function TrendIcon({ trend }) {
  if (trend === "up")   return <TrendingUp   size={11} className="text-emerald-400" />;
  if (trend === "down") return <TrendingDown size={11} className="text-rose-400"    />;
  return                       <Minus        size={11} className="text-white/30"    />;
}

function SkillBar({ skill, index }) {
  const color = CATEGORY_COLORS[skill.category] || "#6366f1";
  const levelLabel = skill.level >= 80 ? "Expert" : skill.level >= 60 ? "Proficient" : "Learning";

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
      className="flex items-center gap-3 group"
    >
      {/* Skill name */}
      <div className="w-24 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-white/75 font-body group-hover:text-white transition-colors truncate">
            {skill.name}
          </span>
          {skill.gap && (
            <span className="text-[9px] px-1.5 py-0.5 rounded font-display font-600 text-amber-300"
              style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)" }}>
              GAP
            </span>
          )}
        </div>
        <span className="text-[10px] text-white/30 font-body">{levelLabel}</span>
      </div>

      {/* Bar */}
      <div className="flex-1 flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${color}cc, ${color})` }}
            initial={{ width: 0 }}
            animate={{ width: `${skill.level}%` }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 + index * 0.05 }}
          />
        </div>
        <span className="w-8 text-right text-xs font-display font-700 flex-shrink-0"
          style={{ color }}>
          {skill.level}
        </span>
        <TrendIcon trend={skill.trend} />
      </div>
    </motion.div>
  );
}

export default function SkillsChart() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? SKILLS : SKILLS.filter(s => s.category === active);
  const gapCount = SKILLS.filter(s => s.gap).length;

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
        style={{ background: "linear-gradient(90deg,transparent,rgba(139,92,246,0.5),transparent)" }} />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-display font-700 text-white text-base">Skills Analysis</h3>
          <p className="text-xs text-white/40 font-body mt-0.5">
            {gapCount} skill {gapCount === 1 ? "gap" : "gaps"} detected
          </p>
        </div>
        <span
          className="text-xs font-display font-600 px-3 py-1 rounded-full text-amber-300"
          style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}
        >
          {gapCount} Gaps
        </span>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className="px-3 py-1 rounded-lg text-xs font-display font-600 transition-all duration-200"
            style={
              active === cat
                ? {
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.3)",
                    color: "#a5b4fc",
                  }
                : {
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.4)",
                  }
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skill bars */}
      <div className="flex flex-col gap-3">
        {filtered.map((skill, i) => (
          <SkillBar key={skill.name} skill={skill} index={i} />
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 pt-2 flex-wrap"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <span key={cat} className="flex items-center gap-1.5 text-[11px] text-white/40 font-body">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
}
