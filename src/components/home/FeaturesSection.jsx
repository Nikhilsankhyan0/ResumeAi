import React from "react";
import { motion } from "framer-motion";
import { ScanSearch, Layers, BriefcaseBusiness, Wand2, MessageSquare, BarChart2 } from "lucide-react";
import { FEATURES } from "../../utils/constants.js";

const ICON_MAP = { ScanSearch, Layers, BriefcaseBusiness, Wand2, MessageSquare, BarChart2 };
const COLOR_MAP = {
  indigo:  { accent:"#6366f1", bg:"rgba(99,102,241,.09)",  border:"rgba(99,102,241,.18)"  },
  violet:  { accent:"#8b5cf6", bg:"rgba(139,92,246,.09)",  border:"rgba(139,92,246,.18)"  },
  blue:    { accent:"#3b82f6", bg:"rgba(59,130,246,.09)",  border:"rgba(59,130,246,.18)"  },
  purple:  { accent:"#a855f7", bg:"rgba(168,85,247,.09)",  border:"rgba(168,85,247,.18)"  },
  emerald: { accent:"#10b981", bg:"rgba(16,185,129,.09)",  border:"rgba(16,185,129,.18)"  },
  amber:   { accent:"#f59e0b", bg:"rgba(245,158,11,.09)",  border:"rgba(245,158,11,.18)"  },
};

function FeatureCard({ feature, index }) {
  const Icon = ICON_MAP[feature.icon] || ScanSearch;
  const c    = COLOR_MAP[feature.color] || COLOR_MAP.indigo;
  return (
    <motion.div
      initial={{ opacity:0, y:28 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:"-40px" }}
      transition={{ duration:.55, ease:[.22,1,.36,1], delay:(index%3)*.08 }}
      className="group glass-card rounded-2xl p-6 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300">
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background:c.bg, border:`1px solid ${c.border}` }}>
          <Icon size={20} style={{ color:c.accent }}/>
        </div>
        <span className="badge text-[10px] font-display font-600"
          style={{ color:c.accent, background:c.bg, border:`1px solid ${c.border}` }}>
          {feature.badge}
        </span>
      </div>
      <div>
        <h3 className="font-display font-700 text-base mb-1.5" style={{ color:"var(--text-primary)" }}>{feature.title}</h3>
        <p className="text-sm font-body leading-relaxed" style={{ color:"var(--text-muted)" }}>{feature.description}</p>
      </div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  return (
    // ← id here is what the scroll link targets
    <section id="features" className="relative py-24">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background:"radial-gradient(ellipse 60% 40% at 50% 50%,rgba(99,102,241,.05) 0%,transparent 65%)" }}/>
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ duration:.55 }}
          className="flex flex-col items-center text-center gap-4 mb-14">
          <span className="badge-indigo text-xs font-display tracking-wider uppercase">Features</span>
          <h2 className="font-display font-800 text-3xl sm:text-4xl leading-tight tracking-tight" style={{ color:"var(--text-primary)" }}>
            Everything you need to{" "}
            <span style={{ background:"linear-gradient(135deg,#818cf8,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              get hired
            </span>
          </h2>
          <p className="text-base max-w-xl font-body leading-relaxed" style={{ color:"var(--text-muted)" }}>
            Powered by the same AI used by top recruiters — now available to every job seeker.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => <FeatureCard key={f.id} feature={f} index={i}/>)}
        </div>
      </div>
    </section>
  );
}
