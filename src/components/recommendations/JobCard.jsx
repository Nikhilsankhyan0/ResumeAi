import React from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, BriefcaseBusiness, DollarSign, Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSaveJob, selectJobs, selectAuth } from "../../store/index.js";

function matchStyle(pct) {
  if (pct >= 90) return { color:"#10b981", bg:"rgba(16,185,129,.1)",  border:"rgba(16,185,129,.22)" };
  if (pct >= 75) return { color:"#6366f1", bg:"rgba(99,102,241,.1)",  border:"rgba(99,102,241,.22)" };
  if (pct >= 60) return { color:"#f59e0b", bg:"rgba(245,158,11,.1)",  border:"rgba(245,158,11,.22)" };
  return               { color:"#f43f5e", bg:"rgba(244,63,94,.1)",   border:"rgba(244,63,94,.22)"  };
}

function sourceBadge(source) {
  if (source === "LinkedIn") return { bg:"rgba(14,118,168,.12)", border:"rgba(14,118,168,.25)", color:"#0e76a8" };
  if (source === "Naukri")   return { bg:"rgba(255,126,37,.12)",  border:"rgba(255,126,37,.25)",  color:"#ff7e25" };
  return                            { bg:"rgba(99,102,241,.12)",  border:"rgba(99,102,241,.25)",  color:"#6366f1" };
}

/**
 * JobCard — reusable card for job listings
 * Props:
 *   job     — job object
 *   index   — number (stagger delay)
 *   variant — "default" | "compact"
 */
export default function JobCard({ job, index = 0, variant = "default" }) {
  const dispatch      = useDispatch();
  const { savedJobs } = useSelector(selectJobs);
  const { user }      = useSelector(selectAuth);
  const isSaved       = savedJobs.includes(job.id);
  const ms            = matchStyle(job.match ?? 0);
  const src           = sourceBadge(job.source);
  const initial       = (job.company ?? "J")[0].toUpperCase();
  const isCompact     = variant === "compact";

  function handleSave(e) {
    e.stopPropagation();
    dispatch(toggleSaveJob({ id: job.id, userId: user?.id }));
  }

  function handleApply(e) {
    e.stopPropagation();
    const url = job.applyUrl || `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.title || "engineer")}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <motion.div
      initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
      transition={{ duration:.32, ease:"easeOut", delay: index * .05 }}
      className="group glass-card rounded-2xl relative overflow-hidden hover:-translate-y-0.5 transition-transform duration-200"
      style={{ padding: isCompact ? "0.875rem 1rem" : "1.25rem" }}>

      <div className="absolute top-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background:`linear-gradient(90deg,transparent,${ms.color}60,transparent)` }}/>

      <div className={`flex ${isCompact ? "items-center gap-3" : "flex-col sm:flex-row sm:items-start gap-4"}`}>

        {/* Avatar */}
        <div className={`rounded-xl flex items-center justify-center font-display font-800 flex-shrink-0 ${isCompact ? "w-9 h-9 text-sm rounded-lg" : "w-12 h-12 text-base"}`}
          style={{ background:ms.bg, border:`1px solid ${ms.border}`, color:ms.color }}>
          {initial}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className={`font-display font-700 group-hover:text-indigo-400 transition-colors truncate ${isCompact ? "text-sm" : "text-base"}`}
                  style={{ color:"var(--text-primary)" }}>{job.title}</p>
                {job.source && (
                  <span className="text-[10px] font-display font-700 px-2 py-0.5 rounded-full"
                    style={{ color:src.color, background:src.bg, border:`1px solid ${src.border}` }}>
                    {job.source}
                  </span>
                )}
              </div>
              <p className="text-xs font-body mt-0.5" style={{ color:"var(--text-muted)" }}>{job.company}</p>
            </div>
            <span className="text-[11px] font-display font-700 px-2.5 py-0.5 rounded-full flex-shrink-0"
              style={{ color:ms.color, background:ms.bg, border:`1px solid ${ms.border}` }}>
              {job.match}% match
            </span>
          </div>

          {!isCompact && (
            <>
              <div className="flex flex-wrap items-center gap-3">
                {job.location && <span className="flex items-center gap-1 text-[11px] font-body" style={{ color:"var(--text-muted)" }}><MapPin size={10}/>{job.location}</span>}
                {job.type     && <span className="flex items-center gap-1 text-[11px] font-body" style={{ color:"var(--text-muted)" }}><BriefcaseBusiness size={10}/>{job.type}</span>}
                {job.salary   && <span className="flex items-center gap-1 text-[11px] font-body" style={{ color:"var(--text-muted)" }}><DollarSign size={10}/>{job.salary}</span>}
                {job.posted   && <span className="flex items-center gap-1 text-[11px] font-body" style={{ color:"var(--text-subtle)" }}><Clock size={10}/>{job.posted}</span>}
              </div>

              {job.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {job.tags.map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-md font-body"
                      style={{ background:"rgba(255,255,255,.04)", border:"1px solid var(--border-color)", color:"var(--text-muted)" }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Match bar */}
              <div className="h-1.5 rounded-full mt-1" style={{ background:"rgba(255,255,255,.06)" }}>
                <motion.div className="h-full rounded-full" style={{ background:ms.color }}
                  initial={{ width:0 }} animate={{ width:`${job.match}%` }}
                  transition={{ duration:.9, ease:"easeOut", delay:.2 + index*.04 }}/>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className={`flex items-center gap-2 flex-shrink-0 ${!isCompact ? "sm:self-start" : ""}`}>
          <button onClick={handleSave} title={isSaved ? "Remove saved" : "Save job"}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
              isSaved ? "text-indigo-400 bg-indigo-500/12 border border-indigo-500/25"
                      : "text-white/30 hover:text-white/70 hover:bg-white/06 border border-transparent"
            }`}>
            {isSaved ? <BookmarkCheck size={14}/> : <Bookmark size={14}/>}
          </button>
          {!isCompact && (
            <button onClick={handleApply} className="btn-primary flex items-center gap-1.5 text-xs py-2 px-4">
              Apply <ExternalLink size={11}/>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
