import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Upload, Sparkles, CheckCircle2, TrendingUp, BriefcaseBusiness, Star, ChevronDown } from "lucide-react";
import { HERO_STATS } from "../../utils/constants.js";

export default function HeroSection() {
  const navigate = useNavigate();

  function scrollToFeatures() {
    const el = document.getElementById("features");
    if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
  }

  const stagger = { hidden:{}, show:{ transition:{ staggerChildren:.1, delayChildren:.05 } } };
  const fadeUp  = { hidden:{ opacity:0, y:22 }, show:{ opacity:1, y:0, transition:{ duration:.65, ease:[.22,1,.36,1] } } };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-16">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[.03]"
          style={{ backgroundImage:"linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)", backgroundSize:"64px 64px" }}/>
        <div className="absolute -top-40 left-1/2 w-[700px] h-[480px] -translate-x-1/2 rounded-full opacity-20"
          style={{ background:"radial-gradient(ellipse at center,rgba(99,102,241,.65) 0%,transparent 65%)", filter:"blur(60px)" }}/>
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full opacity-15"
          style={{ background:"radial-gradient(ellipse at center,rgba(139,92,246,.7) 0%,transparent 65%)", filter:"blur(70px)" }}/>
        <div className="absolute bottom-0 -left-24 w-80 h-80 rounded-full opacity-10"
          style={{ background:"radial-gradient(ellipse at center,rgba(59,130,246,.7) 0%,transparent 65%)", filter:"blur(60px)" }}/>
      </div>

      <div className="relative max-w-5xl mx-auto px-5 sm:px-8 w-full flex flex-col items-center text-center">
        <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col items-center gap-6 max-w-3xl">

          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="flex items-center gap-2">
            <span className="badge-indigo inline-flex items-center gap-1.5">
              <Sparkles size={10} className="text-indigo-400"/>Powered by Advanced AI
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color:"var(--text-subtle)" }}>
              <Star size={10} className="text-amber-400 fill-amber-400"/>4.9 · 2.4M+ users
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUp}
            className="font-display font-800 text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.1] tracking-tight"
            style={{ color:"var(--text-primary)" }}>
            Your Resume,{" "}
            <span style={{ background:"linear-gradient(135deg,#818cf8 0%,#a78bfa 45%,#67e8f9 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              Supercharged
            </span>{" "}by AI
          </motion.h1>

          {/* Subtext */}
          <motion.p variants={fadeUp} className="text-base sm:text-lg leading-relaxed font-body max-w-2xl" style={{ color:"var(--text-muted)" }}>
            Instant ATS scoring, skill-gap analysis, and AI-powered job matching — land your dream role{" "}
            <span className="italic" style={{ color:"var(--text-primary)" }}>3× faster</span>.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => navigate("/register")}
              className="btn-primary text-sm px-7 py-3 flex items-center gap-2">
              <Upload size={15}/>Analyze My Resume<ArrowRight size={14}/>
            </button>
            <button onClick={scrollToFeatures}
              className="btn-secondary text-sm px-6 py-3">
              See Features
            </button>
          </motion.div>

          {/* Trust */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-5">
            {["No credit card required","Results in 60 seconds","Free forever plan"].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-xs font-body" style={{ color:"var(--text-muted)" }}>
                <CheckCircle2 size={12} className="text-emerald-400"/>{t}
              </span>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 w-full max-w-2xl"
            style={{ borderTop:"1px solid rgba(255,255,255,.06)" }}>
            {HERO_STATS.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="font-display font-800 text-2xl leading-none"
                  style={{ background:"linear-gradient(135deg,#818cf8,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                  {value}
                </span>
                <span className="text-xs font-body text-center" style={{ color:"var(--text-muted)" }}>{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll-down arrow */}
      <motion.button onClick={scrollToFeatures}
        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 group"
        style={{ color:"var(--text-subtle)" }}>
        <span className="text-xs font-body group-hover:opacity-70 transition-opacity">Explore features</span>
        <motion.div animate={{ y:[0,5,0] }} transition={{ duration:1.8, repeat:Infinity, ease:"easeInOut" }}>
          <ChevronDown size={18}/>
        </motion.div>
      </motion.button>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
        style={{ background:"linear-gradient(to bottom,transparent,var(--bg-primary))" }}/>
    </section>
  );
}
