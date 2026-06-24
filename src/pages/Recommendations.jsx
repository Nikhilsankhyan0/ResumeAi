import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BriefcaseBusiness, MapPin, Clock, Bookmark, BookmarkCheck,
  ArrowRight, Upload, Filter, Search, ExternalLink,
  DollarSign, X, ChevronDown, Sparkles, Globe,
} from "lucide-react";
import { selectResume, selectJobs, selectAuth, toggleSaveJob } from "../store/index.js";
import { JOB_TYPES } from "../utils/constants.js";

const FALLBACK_JOBS = [
  { id:1,  title:"Software Engineer",            company:"Google",      location:"Bangalore",     type:"Full-time", match:85, salary:"$120–160k", posted:"1d ago",  tags:["Python","Go","System Design"],          applyUrl:"https://www.linkedin.com/jobs/software-engineer-jobs-bangalore/",      source:"LinkedIn"   },
  { id:2,  title:"Frontend Developer",           company:"Microsoft",   location:"Hyderabad",     type:"Full-time", match:80, salary:"$90–120k",  posted:"2d ago",  tags:["React","TypeScript","Azure"],           applyUrl:"https://www.naukri.com/frontend-developer-jobs",                      source:"Naukri"     },
  { id:3,  title:"Data Analyst",                 company:"Amazon",      location:"Remote",        type:"Full-time", match:76, salary:"$80–110k",  posted:"1d ago",  tags:["SQL","Python","AWS"],                   applyUrl:"https://www.linkedin.com/jobs/data-analyst-jobs/",                    source:"LinkedIn"   },
  { id:4,  title:"Full Stack Developer",         company:"Flipkart",    location:"Bangalore",     type:"Full-time", match:73, salary:"$85–115k",  posted:"3d ago",  tags:["Node.js","React","MongoDB"],            applyUrl:"https://www.naukri.com/full-stack-developer-jobs",                    source:"Naukri"     },
  { id:5,  title:"Backend Engineer",             company:"Razorpay",    location:"Bangalore",     type:"Full-time", match:70, salary:"$90–130k",  posted:"2d ago",  tags:["Java","Spring Boot","MySQL"],           applyUrl:"https://www.linkedin.com/jobs/backend-engineer-jobs-bangalore/",       source:"LinkedIn"   },
  { id:6,  title:"DevOps Engineer",              company:"Zomato",      location:"Remote",        type:"Full-time", match:67, salary:"$75–100k",  posted:"5d ago",  tags:["Docker","Kubernetes","AWS"],            applyUrl:"https://www.naukri.com/devops-engineer-jobs",                         source:"Naukri"     },
];

function sourceBadge(source) {
  if (source === "LinkedIn") return { bg:"rgba(14,118,168,.12)", border:"rgba(14,118,168,.25)", color:"#0e76a8", label:"LinkedIn" };
  if (source === "Naukri")   return { bg:"rgba(255,126,37,.12)",  border:"rgba(255,126,37,.25)",  color:"#ff7e25", label:"Naukri"   };
  return                            { bg:"rgba(99,102,241,.12)",  border:"rgba(99,102,241,.25)",  color:"#6366f1", label:"Jobs"     };
}

function matchStyle(pct) {
  if (pct >= 90) return { color:"#10b981", bg:"rgba(16,185,129,.1)",  border:"rgba(16,185,129,.22)" };
  if (pct >= 75) return { color:"#6366f1", bg:"rgba(99,102,241,.1)",  border:"rgba(99,102,241,.22)" };
  if (pct >= 60) return { color:"#f59e0b", bg:"rgba(245,158,11,.1)",  border:"rgba(245,158,11,.22)" };
  return               { color:"#f43f5e", bg:"rgba(244,63,94,.1)",   border:"rgba(244,63,94,.22)"  };
}

function JobCard({ job, index, isSaved, onToggleSave }) {
  const ms  = matchStyle(job.match ?? 0);
  const src = sourceBadge(job.source);
  const ini = (job.company ?? "J")[0].toUpperCase();

  function handleApply(e) {
    e.stopPropagation();
    if (job.applyUrl) window.open(job.applyUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <motion.div
      initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
      transition={{ duration:.32, ease:"easeOut", delay: index * .04 }}
      className="group glass-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-start gap-4 relative overflow-hidden">

      <div className="absolute top-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background:`linear-gradient(90deg,transparent,${ms.color}60,transparent)` }}/>

      {/* Avatar */}
      <div className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-800 text-base flex-shrink-0"
        style={{ background:ms.bg, border:`1px solid ${ms.border}`, color:ms.color }}>
        {ini}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-display font-700 text-sm group-hover:text-indigo-400 transition-colors"
                style={{ color:"var(--text-primary)" }}>{job.title}</p>
              {/* Source badge */}
              <span className="text-[10px] font-display font-700 px-2 py-0.5 rounded-full"
                style={{ color:src.color, background:src.bg, border:`1px solid ${src.border}` }}>
                {src.label}
              </span>
            </div>
            <p className="text-xs font-body mt-0.5" style={{ color:"var(--text-muted)" }}>{job.company}</p>
          </div>
          <span className="text-xs font-display font-700 px-2.5 py-0.5 rounded-full flex-shrink-0"
            style={{ color:ms.color, background:ms.bg, border:`1px solid ${ms.border}` }}>
            {job.match}% match
          </span>
        </div>

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
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0 sm:self-start">
        <button onClick={e => { e.stopPropagation(); onToggleSave(); }}
          title={isSaved ? "Remove saved" : "Save job"}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
            isSaved ? "text-indigo-400 bg-indigo-500/12 border border-indigo-500/25"
                    : "text-white/30 hover:text-white/70 hover:bg-white/06 border border-transparent"
          }`}>
          {isSaved ? <BookmarkCheck size={15}/> : <Bookmark size={15}/>}
        </button>
        <button onClick={handleApply}
          className="btn-primary flex items-center gap-1.5 text-xs py-2 px-4">
          Apply <ExternalLink size={11}/>
        </button>
      </div>
    </motion.div>
  );
}

export default function Recommendations() {
  const dispatch           = useDispatch();
  const navigate           = useNavigate();
  const { analysisResult } = useSelector(selectResume);
  const { savedJobs }      = useSelector(selectJobs);
  const { user }           = useSelector(selectAuth);
  const userId             = user?.id;

  // Use real ML jobs if available, else fallback
  const rawJobs = (analysisResult?.job_listings ?? []).map((j, i) => ({
    ...j,
    // Add LinkedIn/Naukri URLs based on job title
    applyUrl: j.applyUrl || buildApplyUrl(j.title, j.location),
    source:   j.source   || (i % 2 === 0 ? "LinkedIn" : "Naukri"),
    posted:   j.posted   || `${i + 1}d ago`,
  }));

  const jobs = rawJobs.length > 0 ? rawJobs : FALLBACK_JOBS;

  const [search,     setSearch]     = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy,     setSortBy]     = useState("match");

  const visible = React.useMemo(() => {
    let list = [...jobs];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(j =>
        j.title?.toLowerCase().includes(q) ||
        j.company?.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q) ||
        j.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    if (typeFilter !== "all") list = list.filter(j => j.type?.toLowerCase() === typeFilter.toLowerCase());
    if (sortBy === "match") list.sort((a,b) => (b.match??0) - (a.match??0));
    return list;
  }, [jobs, search, typeFilter, sortBy]);

  const avgMatch = jobs.length ? Math.round(jobs.reduce((s,j) => s+(j.match??0), 0) / jobs.length) : 0;
  const savedCnt = jobs.filter(j => savedJobs.includes(j.id)).length;

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:.4 }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-800 text-2xl" style={{ color:"var(--text-primary)" }}>Job Recommendations</h1>
            <p className="text-sm mt-1 font-body" style={{ color:"var(--text-muted)" }}>
              {jobs.length} AI-matched roles{analysisResult ? " based on your resume" : " — upload resume for personalized matches"}
            </p>
          </div>
          {!analysisResult && (
            <button onClick={() => navigate("/analyze")} className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2">
              <Upload size={14}/> Analyze Resume <ArrowRight size={13}/>
            </button>
          )}
        </div>
      </motion.div>

      {/* Source legend */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:.06 }}
        className="flex flex-wrap items-center gap-3 text-xs font-body" style={{ color:"var(--text-muted)" }}>
        <Globe size={13} className="text-indigo-400"/>
        <span>Jobs sourced from:</span>
        {[
          { label:"LinkedIn", color:"#0e76a8" },
          { label:"Naukri",   color:"#ff7e25" },
        ].map(({ label, color }) => (
          <span key={label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-display font-600"
            style={{ color, background:`${color}15`, border:`1px solid ${color}30` }}>
            {label}
          </span>
        ))}
        <span className="ml-auto text-[11px]" style={{ color:"var(--text-subtle)" }}>Click Apply to go to the platform</span>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:.08 }}
        className="grid grid-cols-3 gap-4">
        {[
          { label:"Total Matches", value:jobs.length, color:"#6366f1" },
          { label:"Avg Match",     value:`${avgMatch}%`, color:"#10b981" },
          { label:"Saved",         value:savedCnt, color:"#f59e0b" },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card rounded-xl px-4 py-3.5 flex items-center gap-3">
            <p className="font-display font-800 text-xl" style={{ color:"var(--text-primary)" }}>{value}</p>
            <p className="text-xs font-body" style={{ color:"var(--text-muted)" }}>{label}</p>
          </div>
        ))}
      </motion.div>

      {/* Search + filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color:"var(--text-subtle)" }}/>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by role, company, skill…" className="input-glass pl-9 py-2.5 text-sm"/>
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-rose-400 transition-colors" style={{ color:"var(--text-subtle)" }}>
              <X size={13}/>
            </button>
          )}
        </div>
        <button onClick={() => setShowFilter(!showFilter)}
          className={`btn-secondary flex items-center gap-2 text-sm py-2.5 ${showFilter ? "border-indigo-500/30 text-indigo-300" : ""}`}>
          <Filter size={13}/>Filter
          <motion.div animate={{ rotate:showFilter ? 180 : 0 }} transition={{ duration:.2 }}><ChevronDown size={12}/></motion.div>
        </button>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="input-glass py-2.5 text-sm w-auto pr-8 cursor-pointer"
          style={{ background:"var(--bg-card)" }}>
          <option value="match">Best Match</option>
          <option value="recent">Most Recent</option>
        </select>
      </div>

      {/* Filter pills */}
      <AnimatePresence>
        {showFilter && (
          <motion.div key="filters"
            initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }}
            exit={{ opacity:0, height:0 }} transition={{ duration:.22 }} className="overflow-hidden">
            <div className="flex flex-wrap gap-2 pb-1">
              {JOB_TYPES.map(({ value, label }) => (
                <button key={value} onClick={() => setTypeFilter(value)}
                  className="px-3 py-1.5 rounded-xl text-xs font-display font-600 transition-all duration-200"
                  style={typeFilter === value
                    ? { background:"rgba(99,102,241,.15)", border:"1px solid rgba(99,102,241,.3)", color:"#a5b4fc" }
                    : { background:"rgba(255,255,255,.03)", border:"1px solid var(--border-color)", color:"var(--text-muted)" }}>
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Job cards */}
      {visible.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-4 text-center">
          <BriefcaseBusiness size={36} style={{ color:"var(--text-subtle)" }}/>
          <p className="font-display font-700" style={{ color:"var(--text-muted)" }}>No jobs match your filters</p>
          <button onClick={() => { setSearch(""); setTypeFilter("all"); }} className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">Clear filters</button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((job, i) => (
            <JobCard key={job.id} job={job} index={i}
              isSaved={savedJobs.includes(job.id)}
              onToggleSave={() => dispatch(toggleSaveJob({ id:job.id, userId }))}/>
          ))}
        </div>
      )}

      {/* Nudge */}
      {!analysisResult && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.5 }}
          className="relative rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 overflow-hidden"
          style={{ background:"linear-gradient(135deg,rgba(79,70,229,.12),rgba(124,58,237,.08))", border:"1px solid rgba(99,102,241,.2)" }}>
          <div className="absolute top-0 inset-x-0 h-px"
            style={{ background:"linear-gradient(90deg,transparent,rgba(99,102,241,.5),transparent)" }}/>
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-indigo-400 flex-shrink-0"/>
            <div>
              <p className="font-display font-700 text-sm" style={{ color:"var(--text-primary)" }}>Showing general job listings</p>
              <p className="text-xs mt-0.5 font-body" style={{ color:"var(--text-muted)" }}>Upload your resume for AI-personalized matches from LinkedIn & Naukri.</p>
            </div>
          </div>
          <button onClick={() => navigate("/analyze")} className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2 flex-shrink-0">
            Upload Resume <ArrowRight size={13}/>
          </button>
        </motion.div>
      )}
    </div>
  );
}

function buildApplyUrl(title, location) {
  const t   = encodeURIComponent(title || "software engineer");
  const loc = encodeURIComponent(location || "India");
  // Alternate between LinkedIn and Naukri
  const seed = (title?.charCodeAt(0) ?? 0) % 2;
  if (seed === 0) return `https://www.linkedin.com/jobs/search/?keywords=${t}&location=${loc}`;
  return              `https://www.naukri.com/${t.toLowerCase().replace(/%20/g,"-")}-jobs-in-${loc.toLowerCase().replace(/%20/g,"-")}`;
}
