import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Upload, Check, Sparkles, Shield, Zap } from "lucide-react";

const PERKS = ["Free forever plan","No credit card required","Setup in 30 seconds","Cancel anytime"];

export default function CTASection() {
  const navigate = useNavigate();
  return (
    <section id="pricing" className="relative py-24">
      <div className="relative max-w-4xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:.65, ease:[.22,1,.36,1] }}
          className="relative rounded-3xl overflow-hidden p-10 sm:p-14 flex flex-col items-center text-center gap-8"
          style={{
            background:"linear-gradient(135deg,rgba(79,70,229,.18) 0%,rgba(124,58,237,.12) 50%,rgba(59,130,246,.1) 100%)",
            border:"1px solid rgba(99,102,241,.22)",
            backdropFilter:"blur(32px)",
          }}>
          <div className="absolute top-0 inset-x-0 h-px"
            style={{ background:"linear-gradient(90deg,transparent,rgba(99,102,241,.7) 50%,transparent)" }}/>
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 pointer-events-none"
            style={{ background:"radial-gradient(ellipse at center,rgba(99,102,241,.35) 0%,transparent 65%)", filter:"blur(40px)" }}/>

          <span className="relative badge-indigo inline-flex items-center gap-2">
            <Sparkles size={11}/> Start For Free Today
          </span>

          <h2 className="relative font-display font-800 text-4xl sm:text-5xl leading-[1.1] tracking-tight" style={{ color:"var(--text-primary)" }}>
            Ready to land your{" "}
            <span style={{ background:"linear-gradient(135deg,#818cf8 0%,#a78bfa 50%,#67e8f9 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              dream job?
            </span>
          </h2>

          <p className="relative text-base sm:text-lg max-w-xl leading-relaxed font-body" style={{ color:"var(--text-muted)" }}>
            Join 2.4M+ professionals who upgraded their resumes with AI. Upload yours and get results in under a minute.
          </p>

          <div className="relative flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {PERKS.map(p => (
              <span key={p} className="flex items-center gap-1.5 text-sm font-body" style={{ color:"var(--text-muted)" }}>
                <Check size={13} className="text-emerald-400 flex-shrink-0"/>{p}
              </span>
            ))}
          </div>

          <div className="relative flex flex-wrap items-center justify-center gap-4">
            <button onClick={() => navigate("/register")}
              className="btn-primary text-sm px-8 py-3.5 flex items-center gap-2">
              <Upload size={15}/>Analyze My Resume Free<ArrowRight size={14}/>
            </button>
            <button onClick={() => navigate("/login")} className="btn-secondary text-sm px-7 py-3.5">
              Sign In
            </button>
          </div>

          <div className="relative flex flex-wrap items-center justify-center gap-6 pt-2"
            style={{ borderTop:"1px solid rgba(255,255,255,.06)", paddingTop:"1.5rem" }}>
            {[{icon:Shield,text:"SOC 2 Compliant"},{icon:Zap,text:"Results in <60s"},{icon:Sparkles,text:"AI-powered analysis"}].map(({icon:Icon,text}) => (
              <span key={text} className="flex items-center gap-1.5 text-xs font-body" style={{ color:"var(--text-subtle)" }}>
                <Icon size={13} className="text-indigo-400"/>{text}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
