import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, BookOpen, ExternalLink, ChevronDown, ChevronUp, Lightbulb, CheckCircle2 } from "lucide-react";
import { useSelector } from "react-redux";
import { selectResume } from "../../store/index.js";

const RESOURCES = {
  Docker:       [{ label:"Play with Docker",   url:"https://labs.play-with-docker.com" }, { label:"Docker Docs", url:"https://docs.docker.com/get-started" }],
  AWS:          [{ label:"AWS Free Tier",       url:"https://aws.amazon.com/free" },        { label:"AWS Skill Builder", url:"https://skillbuilder.aws" }],
  Kubernetes:   [{ label:"Killercoda Labs",     url:"https://killercoda.com/playgrounds/scenario/kubernetes" }, { label:"K8s Docs", url:"https://kubernetes.io/docs/tutorials" }],
  Python:       [{ label:"Python Tutorial",     url:"https://docs.python.org/3/tutorial" }, { label:"freeCodeCamp", url:"https://www.freecodecamp.org/learn" }],
  GraphQL:      [{ label:"GraphQL Docs",         url:"https://graphql.org/learn" },           { label:"Apollo Odyssey", url:"https://www.apollographql.com/tutorials" }],
  spark:        [{ label:"Apache Spark Docs",   url:"https://spark.apache.org/docs/latest" }, { label:"Databricks Free", url:"https://community.cloud.databricks.com" }],
  hadoop:       [{ label:"Hadoop Tutorial",     url:"https://hadoop.apache.org/docs/stable" }, { label:"Cloudera Learn", url:"https://www.cloudera.com/learn" }],
  "machine learning":[{ label:"ML Course - Coursera", url:"https://www.coursera.org/learn/machine-learning" }, { label:"fast.ai", url:"https://www.fast.ai" }],
  airflow:      [{ label:"Airflow Docs",        url:"https://airflow.apache.org/docs" },      { label:"Astronomer Guide", url:"https://www.astronomer.io/learn" }],
};

function getResources(skill) {
  const key = Object.keys(RESOURCES).find(k => k.toLowerCase() === skill.toLowerCase());
  if (key) return RESOURCES[key];
  return [
    { label:`${skill} Tutorial`, url:`https://www.google.com/search?q=${encodeURIComponent(skill + " tutorial")}` },
    { label:`${skill} on Coursera`, url:`https://www.coursera.org/search?query=${encodeURIComponent(skill)}` },
  ];
}

const PRIORITY = {
  high:   { label:"High Priority",   color:"#f43f5e", bg:"rgba(244,63,94,.1)",   border:"rgba(244,63,94,.22)"  },
  medium: { label:"Medium Priority", color:"#f59e0b", bg:"rgba(245,158,11,.1)",  border:"rgba(245,158,11,.22)" },
  low:    { label:"Low Priority",    color:"#6366f1", bg:"rgba(99,102,241,.1)",  border:"rgba(99,102,241,.22)" },
};

function assignPriority(i, total) {
  if (i < Math.ceil(total/3))         return "high";
  if (i < Math.ceil((2*total)/3))     return "medium";
  return "low";
}

function SkillRow({ skillName, priority, index }) {
  const [open, setOpen] = useState(false);
  const p   = PRIORITY[priority];
  const res = getResources(skillName);

  return (
    <motion.div initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
      transition={{ duration:.3, delay: index * .06 }}
      className="rounded-xl overflow-hidden"
      style={{
        background: open ? p.bg : "rgba(255,255,255,.02)",
        border: `1px solid ${open ? p.border : "rgba(255,255,255,.06)"}`,
        transition: "background .2s, border-color .2s",
      }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:p.color }}/>
        <span className="flex-1 text-sm font-display font-700" style={{ color:"var(--text-primary)" }}>{skillName}</span>
        <span className="hidden sm:inline-flex text-[10px] font-display font-600 px-2 py-0.5 rounded-full"
          style={{ color:p.color, background:p.bg, border:`1px solid ${p.border}` }}>{p.label}</span>
        <span style={{ color:"var(--text-subtle)" }}>{open ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="body"
            initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }}
            exit={{ height:0, opacity:0 }} transition={{ duration:.22 }} className="overflow-hidden">
            <div className="px-4 pb-4 flex flex-col gap-3" style={{ paddingLeft:"2.75rem" }}>
              <p className="text-xs font-body" style={{ color:"var(--text-subtle)" }}>Suggested resources:</p>
              <div className="flex flex-col gap-2">
                {res.map(r => (
                  <a key={r.label} href={r.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-body text-indigo-300 hover:text-indigo-200 transition-colors group/lnk">
                    <BookOpen size={11} className="flex-shrink-0"/>
                    <span className="flex-1">{r.label}</span>
                    <ExternalLink size={10} className="opacity-0 group-hover/lnk:opacity-100 transition-opacity"/>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function MissingSkills({ gaps: propGaps }) {
  const { analysisResult } = useSelector(selectResume);
  const reduxGaps = analysisResult?.missing_skills ?? analysisResult?.gaps ?? [];
  const skills    = analysisResult?.skills ?? [];
  const gaps      = (propGaps ?? (reduxGaps.length > 0 ? reduxGaps : ["Docker","AWS","Kubernetes"]))
    .map(s => typeof s === "string" ? s : s.name);

  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? gaps : gaps.slice(0, 4);

  return (
    <div className="relative glass-card rounded-2xl p-6 flex flex-col gap-5 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background:"linear-gradient(90deg,transparent,rgba(245,158,11,.5),transparent)" }}/>

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background:"rgba(245,158,11,.1)", border:"1px solid rgba(245,158,11,.22)" }}>
            <AlertTriangle size={16} className="text-amber-400"/>
          </div>
          <div>
            <h3 className="font-display font-700 text-base" style={{ color:"var(--text-primary)" }}>Missing Skills</h3>
            <p className="text-xs font-body mt-0.5" style={{ color:"var(--text-muted)" }}>{gaps.length} skill gaps detected</p>
          </div>
        </div>
        <span className="text-xs font-display font-600 px-2.5 py-1 rounded-full text-amber-300 flex-shrink-0"
          style={{ background:"rgba(245,158,11,.1)", border:"1px solid rgba(245,158,11,.2)" }}>
          {gaps.length} Gaps
        </span>
      </div>

      <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl"
        style={{ background:"rgba(99,102,241,.07)", border:"1px solid rgba(99,102,241,.15)" }}>
        <Lightbulb size={14} className="text-indigo-400 flex-shrink-0 mt-0.5"/>
        <p className="text-xs font-body leading-relaxed" style={{ color:"var(--text-muted)" }}>
          Addressing these gaps could increase your job match rate by{" "}
          <span className="text-indigo-300 font-display font-700">+{gaps.length * 6}%</span>. Click any skill for free learning resources.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {visible.map((skill, i) => (
          <SkillRow key={skill} skillName={skill} priority={assignPriority(i, gaps.length)} index={i}/>
        ))}
      </div>

      {gaps.length > 4 && (
        <button onClick={() => setShowAll(!showAll)}
          className="flex items-center justify-center gap-1.5 text-xs font-display font-600 transition-colors hover:text-white/70 pt-1"
          style={{ color:"var(--text-subtle)" }}>
          {showAll ? <><ChevronUp size={13}/>Show less</> : <><ChevronDown size={13}/>Show {gaps.length-4} more</>}
        </button>
      )}

      <div className="flex items-center justify-between pt-2 flex-wrap gap-2"
        style={{ borderTop:"1px solid rgba(255,255,255,.06)" }}>
        <span className="flex items-center gap-1.5 text-xs font-body" style={{ color:"var(--text-subtle)" }}>
          <CheckCircle2 size={12} className="text-emerald-400"/>
          {skills.length > 0 ? `${skills.length} skills already on your resume` : "Upload resume to compare"}
        </span>
      </div>
    </div>
  );
}
