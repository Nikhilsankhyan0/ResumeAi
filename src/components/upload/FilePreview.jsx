import React from "react";
import { motion } from "framer-motion";
import { FileText, X, CheckCircle2, HardDrive, Calendar } from "lucide-react";

const fmtBytes = b => b < 1024 ? `${b} B` : b < 1048576 ? `${(b/1024).toFixed(1)} KB` : `${(b/1048576).toFixed(2)} MB`;
const fmtDate  = ts => new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",year:"numeric"}).format(new Date(ts));

function extStyle(name="") {
  const ext = name.split(".").pop().toLowerCase();
  if (ext==="pdf")  return { color:"#f43f5e", bg:"rgba(244,63,94,.1)",  border:"rgba(244,63,94,.22)"  };
  if (ext==="docx") return { color:"#3b82f6", bg:"rgba(59,130,246,.1)", border:"rgba(59,130,246,.22)" };
  return               { color:"#6366f1", bg:"rgba(99,102,241,.1)", border:"rgba(99,102,241,.22)" };
}

export default function FilePreview({ file, progress=null, onRemove }) {
  if (!file) return null;
  const { color, bg, border } = extStyle(file.name);
  const ext         = file.name.split(".").pop().toUpperCase();
  const isUploading = progress !== null && progress < 100;
  const isDone      = progress === 100;

  return (
    <motion.div initial={{ opacity:0, y:10, scale:.98 }} animate={{ opacity:1, y:0, scale:1 }}
      exit={{ opacity:0, y:-8, scale:.97 }} transition={{ duration:.28, ease:[.22,1,.36,1] }}
      className="relative rounded-2xl p-5 flex flex-col gap-4 overflow-hidden"
      style={{ background:"rgba(10,10,26,.8)", border:`1px solid ${border}`, backdropFilter:"blur(20px)" }}>
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background:`linear-gradient(90deg,transparent,${color}70,transparent)` }}/>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 flex-shrink-0"
          style={{ background:bg, border:`1px solid ${border}` }}>
          <FileText size={18} style={{ color }}/>
          <span className="text-[9px] font-display font-800 leading-none" style={{ color }}>{ext}</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-display font-700 truncate" style={{ color:"var(--text-primary)" }}>{file.name}</p>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="flex items-center gap-1 text-[11px] font-body" style={{ color:"var(--text-muted)" }}>
              <HardDrive size={9}/>{fmtBytes(file.size)}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-body" style={{ color:"var(--text-muted)" }}>
              <Calendar size={9}/>{fmtDate(file.lastModified)}
            </span>
            {isDone && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-body">
                <CheckCircle2 size={9}/> Uploaded
              </span>
            )}
          </div>
        </div>

        {!isUploading && onRemove && (
          <button onClick={onRemove}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0 hover:text-white hover:bg-white/07"
            style={{ color:"var(--text-subtle)" }}>
            <X size={14}/>
          </button>
        )}
      </div>

      {isUploading && (
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs font-body">
            <span style={{ color:"var(--text-muted)" }}>Uploading…</span>
            <span className="font-display font-700 text-indigo-400">{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background:"rgba(255,255,255,.07)" }}>
            <motion.div className="h-full rounded-full"
              style={{ background:"linear-gradient(90deg,#4f46e5,#8b5cf6)" }}
              initial={{ width:0 }} animate={{ width:`${progress}%` }}
              transition={{ duration:.25, ease:"easeOut" }}/>
          </div>
        </div>
      )}

      {!isUploading && !isDone && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background:"rgba(99,102,241,.07)", border:"1px solid rgba(99,102,241,.15)" }}>
          <CheckCircle2 size={12} className="text-indigo-400 flex-shrink-0"/>
          <span className="text-xs font-body" style={{ color:"var(--text-muted)" }}>
            Ready — click <span className="text-indigo-300 font-display font-600">Analyze Resume</span> to continue
          </span>
        </div>
      )}
    </motion.div>
  );
}
