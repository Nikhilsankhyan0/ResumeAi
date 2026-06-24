import React from "react";
import { motion } from "framer-motion";
import { Upload, Brain, Target, Rocket, ArrowRight } from "lucide-react";
import { HOW_IT_WORKS } from "../../utils/constants.js";
import { useNavigate } from "react-router-dom";

const ICON_MAP   = { Upload, Brain, Target, Rocket };
const STEP_COLORS = [
  { accent:"#6366f1", bg:"rgba(99,102,241,.1)",  border:"rgba(99,102,241,.2)"  },
  { accent:"#8b5cf6", bg:"rgba(139,92,246,.1)",  border:"rgba(139,92,246,.2)"  },
  { accent:"#3b82f6", bg:"rgba(59,130,246,.1)",  border:"rgba(59,130,246,.2)"  },
  { accent:"#10b981", bg:"rgba(16,185,129,.1)",  border:"rgba(16,185,129,.2)"  },
];

export default function HowItWorks() {
  const navigate = useNavigate();
  return (
    // ← id here is what the scroll link targets
    <section id="how-it-works" className="relative py-24">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background:"radial-gradient(ellipse 50% 40% at 80% 60%,rgba(139,92,246,.06) 0%,transparent 65%)" }}/>
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ duration:.55 }}
          className="flex flex-col items-center text-center gap-4 mb-14">
          <span className="badge-violet text-xs font-display tracking-wider uppercase">How It Works</span>
          <h2 className="font-display font-800 text-3xl sm:text-4xl leading-tight tracking-tight" style={{ color:"var(--text-primary)" }}>
            From upload to offer in{" "}
            <span style={{ background:"linear-gradient(135deg,#a78bfa,#67e8f9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              4 simple steps
            </span>
          </h2>
          <p className="text-base max-w-xl font-body leading-relaxed" style={{ color:"var(--text-muted)" }}>
            No setup. Drop your resume and let AI handle the rest.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {HOW_IT_WORKS.map((step, i) => {
            const Icon = ICON_MAP[step.icon] || Upload;
            const c    = STEP_COLORS[i] || STEP_COLORS[0];
            return (
              <motion.div key={step.step}
                initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, margin:"-40px" }}
                transition={{ duration:.55, ease:[.22,1,.36,1], delay: i * .1 }}
                className="glass-card rounded-2xl p-6 flex flex-col items-center text-center gap-4 relative">
                <span className="absolute top-3 right-4 font-display font-800 text-4xl leading-none select-none pointer-events-none"
                  style={{ color:c.accent, opacity:.07 }}>{step.step}</span>
                <motion.div
                  animate={{ boxShadow:[`0 0 0px ${c.accent}40`,`0 0 22px ${c.accent}40`,`0 0 0px ${c.accent}40`] }}
                  transition={{ duration:2, repeat:Infinity, delay: i * .4 }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background:c.bg, border:`1px solid ${c.border}` }}>
                  <Icon size={24} style={{ color:c.accent }}/>
                </motion.div>
                <span className="text-[10px] font-display font-700 tracking-widest px-2.5 py-0.5 rounded-full"
                  style={{ color:c.accent, background:c.bg, border:`1px solid ${c.border}` }}>
                  STEP {step.step}
                </span>
                <div>
                  <h3 className="font-display font-700 text-base mb-2" style={{ color:"var(--text-primary)" }}>{step.title}</h3>
                  <p className="text-sm font-body leading-relaxed" style={{ color:"var(--text-muted)" }}>{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA strip */}
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ duration:.6, delay:.4 }}
          className="mt-14 glass-card rounded-2xl p-7 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <h4 className="font-display font-800 text-xl mb-1" style={{ color:"var(--text-primary)" }}>Ready to land your dream job?</h4>
            <p className="text-sm font-body" style={{ color:"var(--text-muted)" }}>Join 2.4M+ professionals who upgraded their careers.</p>
          </div>
          <button onClick={() => navigate("/register")} className="btn-primary flex items-center gap-2 px-7 py-3 text-sm flex-shrink-0">
            Start for Free <ArrowRight size={14}/>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
