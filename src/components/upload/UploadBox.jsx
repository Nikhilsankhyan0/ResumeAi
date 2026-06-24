import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, AlertCircle, X } from "lucide-react";

const ACCEPTED_EXTS  = [".pdf", ".docx", ".doc"];
const ACCEPTED_TYPES = "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword";
const MAX_MB         = 5;
const MAX_BYTES      = MAX_MB * 1024 * 1024;

function validate(file) {
  if (!file) return "No file selected.";
  const ext = "." + file.name.split(".").pop().toLowerCase();
  if (!ACCEPTED_EXTS.includes(ext))
    return `Unsupported format. Please upload ${ACCEPTED_EXTS.join(", ")}.`;
  if (file.size > MAX_BYTES)
    return `File too large. Max size is ${MAX_MB} MB.`;
  return null;
}

export default function UploadBox({ onFileSelect }) {
  const inputRef          = useRef(null);
  const [dragging, setDrag] = useState(false);
  const [error,    setError] = useState(null);

  function pick(file) {
    const err = validate(file);
    if (err) { setError(err); return; }
    setError(null);
    onFileSelect(file);
  }

  return (
    <div className="flex flex-col gap-3">
      <motion.div
        animate={{
          borderColor: dragging ? "rgba(99,102,241,.65)" : "rgba(255,255,255,.1)",
          background:  dragging ? "rgba(99,102,241,.07)" : "rgba(255,255,255,.02)",
        }}
        transition={{ duration:.15 }}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) setDrag(false); }}
        onDrop={e => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files[0]) pick(e.dataTransfer.files[0]); }}
        onClick={() => inputRef.current?.click()}
        className="relative flex flex-col items-center justify-center gap-5 rounded-2xl p-10 sm:p-14 cursor-pointer select-none"
        style={{ border:"2px dashed rgba(255,255,255,.1)", minHeight:"200px",
          boxShadow: dragging ? "0 0 32px rgba(99,102,241,.12) inset" : "none" }}>
        <input ref={inputRef} type="file" accept={ACCEPTED_TYPES}
          onChange={e => { if (e.target.files[0]) pick(e.target.files[0]); e.target.value=""; }}
          className="hidden"/>

        <motion.div
          animate={{ y: dragging ? -8 : 0, scale: dragging ? 1.08 : 1 }}
          transition={{ type:"spring", stiffness:320, damping:22 }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            background: dragging ? "rgba(99,102,241,.16)" : "rgba(255,255,255,.05)",
            border:     dragging ? "1px solid rgba(99,102,241,.35)" : "1px solid rgba(255,255,255,.08)",
          }}>
          <Upload size={28} style={{ color: dragging ? "#818cf8" : "rgba(255,255,255,.38)" }}/>
        </motion.div>

        <div className="text-center">
          <p className="font-display font-700 text-lg" style={{ color:"var(--text-primary)" }}>
            {dragging ? "Release to upload" : "Drag & drop your resume"}
          </p>
          <p className="text-sm font-body mt-1" style={{ color:"var(--text-muted)" }}>
            or{" "}
            <span className="text-indigo-400 hover:text-indigo-300 transition-colors font-display font-600">
              click to browse
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center">
          {ACCEPTED_EXTS.map(ext => (
            <span key={ext} className="flex items-center gap-1.5 text-[11px] font-display font-600 px-2.5 py-1 rounded-lg"
              style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", color:"var(--text-muted)" }}>
              <FileText size={10}/>{ext.replace(".","").toUpperCase()}
            </span>
          ))}
          <span className="text-[11px] font-body" style={{ color:"var(--text-subtle)" }}>· Max {MAX_MB} MB</span>
        </div>

        <AnimatePresence>
          {dragging && (
            <motion.span key="ring" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ boxShadow:"0 0 0 2px rgba(99,102,241,.45)" }}/>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div key="err"
            initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }}
            transition={{ duration:.2 }}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-body"
            style={{ background:"rgba(244,63,94,.08)", border:"1px solid rgba(244,63,94,.2)", color:"#fda4af" }}>
            <AlertCircle size={14} className="text-rose-400 flex-shrink-0"/>
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} className="hover:text-rose-300 transition-colors"><X size={13}/></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
