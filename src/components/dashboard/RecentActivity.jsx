import React from "react";
import { motion } from "framer-motion";
import {
  Upload, FileSearch, BriefcaseBusiness,
  Bookmark, CheckCircle2, Clock,
} from "lucide-react";

const ACTIVITY = [
  {
    id: 1,
    icon: Upload,
    title: "Resume uploaded",
    detail: "resume_v3_final.pdf",
    time: "2 min ago",
    type: "upload",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.1)",
  },
  {
    id: 2,
    icon: FileSearch,
    title: "ATS analysis complete",
    detail: "Score: 87 / 100 — Excellent",
    time: "2 min ago",
    type: "analysis",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
  },
  {
    id: 3,
    icon: BriefcaseBusiness,
    title: "47 job matches found",
    detail: "Based on your skills profile",
    time: "3 min ago",
    type: "jobs",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
  },
  {
    id: 4,
    icon: Bookmark,
    title: "Job saved",
    detail: "Senior Frontend Engineer — Stripe",
    time: "15 min ago",
    type: "save",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
  },
  {
    id: 5,
    icon: FileSearch,
    title: "Previous analysis",
    detail: "Score: 75 / 100 — Good",
    time: "2 days ago",
    type: "analysis",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.1)",
  },
  {
    id: 6,
    icon: CheckCircle2,
    title: "Profile completed",
    detail: "All sections filled out",
    time: "3 days ago",
    type: "profile",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
  },
];

function ActivityRow({ item, index }) {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.05 }}
      className="flex items-center gap-3 group"
    >
      {/* Icon + connector line */}
      <div className="flex flex-col items-center flex-shrink-0 self-stretch">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: item.bg, border: `1px solid ${item.color}25` }}
        >
          <Icon size={14} style={{ color: item.color }} />
        </div>
        {index < ACTIVITY.length - 1 && (
          <div className="w-px flex-1 mt-1.5"
            style={{ background: "rgba(255,255,255,0.06)", minHeight: "16px" }} />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 pb-4 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-body font-500 text-white/80 group-hover:text-white transition-colors truncate">
            {item.title}
          </span>
          <span className="text-[10px] text-white/30 font-body flex-shrink-0 flex items-center gap-1">
            <Clock size={9} />
            {item.time}
          </span>
        </div>
        <span className="text-xs text-white/38 font-body truncate block">{item.detail}</span>
      </div>
    </motion.div>
  );
}

export default function RecentActivity() {
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
        style={{ background: "linear-gradient(90deg,transparent,rgba(59,130,246,0.5),transparent)" }} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-700 text-white text-base">Recent Activity</h3>
          <p className="text-xs text-white/40 font-body mt-0.5">Your last 6 actions</p>
        </div>
        <button className="text-xs font-display font-600 text-indigo-400 hover:text-indigo-300 transition-colors">
          View all →
        </button>
      </div>

      {/* Activity feed */}
      <div className="flex flex-col">
        {ACTIVITY.map((item, i) => (
          <ActivityRow key={item.id} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}
