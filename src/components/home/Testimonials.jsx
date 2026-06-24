import React, { useRef, useEffect, useState } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { Star, Quote } from "lucide-react";
import SectionTitle from "../ui/SectionTitle.jsx";
import { TESTIMONIALS } from "../../utils/constants.js";

/* Avatar gradient presets */
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#4f46e5,#7c3aed)",
  "linear-gradient(135deg,#0ea5e9,#6366f1)",
  "linear-gradient(135deg,#10b981,#3b82f6)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
];

/* Duplicate array for seamless infinite scroll */
const ALL = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

function TestimonialCard({ t, index }) {
  return (
    <div
      className="flex-shrink-0 w-[320px] sm:w-[360px] rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden"
      style={{
        backdropFilter: "blur(20px)",
        background: "rgba(12,12,28,0.8)",
        border: "1px solid rgba(255,255,255,.07)",
        boxShadow: "0 8px 32px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.03) inset",
      }}
    >
      {/* Top accent */}
      <div className="absolute top-0 left-6 right-6 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,.4), transparent)" }}
      />

      {/* Quote icon */}
      <div className="flex items-start justify-between">
        <div className="flex gap-0.5">
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
          ))}
        </div>
        <Quote size={18} className="text-white/10 flex-shrink-0" />
      </div>

      {/* Text */}
      <p className="text-sm text-white/65 leading-relaxed font-body flex-1">
        "{t.text}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-1"
        style={{ borderTop: "1px solid rgba(255,255,255,.06)" }}>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-display font-700 text-white flex-shrink-0"
          style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}
        >
          {t.avatar}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-display font-700 text-white truncate">{t.name}</p>
          <p className="text-[11px] text-white/40 truncate">
            {t.role} · <span className="text-indigo-400">{t.company}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Marquee row ─────────────────────────────────────────────────────────────── */
function MarqueeRow({ items, direction = 1, speed = 35 }) {
  const trackRef  = useRef(null);
  const offsetRef = useRef(0);
  const [paused, setPaused] = useState(false);

  useAnimationFrame((_, delta) => {
    if (paused || !trackRef.current) return;
    offsetRef.current += (delta / 1000) * speed * direction;
    const totalW = trackRef.current.scrollWidth / 2; // half (duplicated)
    if (direction > 0 && offsetRef.current >= totalW) offsetRef.current -= totalW;
    if (direction < 0 && offsetRef.current <= -totalW) offsetRef.current += totalW;
    trackRef.current.style.transform = `translateX(${-offsetRef.current}px)`;
  });

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div ref={trackRef} className="flex gap-5 w-max">
        {items.map((t, i) => (
          <TestimonialCard key={i} t={t} index={i} />
        ))}
      </div>
    </div>
  );
}

/* ── Section ─────────────────────────────────────────────────────────────────── */
export default function Testimonials() {
  const row1 = ALL;
  const row2 = [...ALL].reverse();

  return (
    <section id="testimonials" className="relative py-24 overflow-hidden">
      {/* ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[600px] opacity-[.06] rounded-full"
          style={{ background: "radial-gradient(ellipse at left, #6366f1 0%, transparent 65%)", filter: "blur(80px)" }}
        />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[500px] opacity-[.05] rounded-full"
          style={{ background: "radial-gradient(ellipse at right, #8b5cf6 0%, transparent 65%)", filter: "blur(80px)" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 mb-14">
        <SectionTitle
          eyebrow="Testimonials"
          title="Loved by job seekers worldwide"
          highlight="job seekers"
          subtitle="Real stories from people who landed their dream jobs using ResumeAI."
          align="center"
          size="lg"
        />

        {/* Aggregate rating */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-center gap-3 mt-8"
        >
          <div className="flex gap-1">
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={18} className="text-amber-400 fill-amber-400" />
            ))}
          </div>
          <span className="font-display font-800 text-white text-xl">4.9</span>
          <span className="text-white/40 text-sm font-body">from 8,200+ reviews</span>
        </motion.div>
      </div>

      {/* Marquee rows */}
      <div className="flex flex-col gap-5">
        {/* Fade masks */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, #070710, transparent)" }}
          />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, #070710, transparent)" }}
          />
          <MarqueeRow items={row1} direction={1} speed={32} />
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, #070710, transparent)" }}
          />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, #070710, transparent)" }}
          />
          <MarqueeRow items={row2} direction={-1} speed={28} />
        </div>
      </div>

      {/* Company logos strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative max-w-4xl mx-auto px-5 sm:px-8 mt-16"
      >
        <p className="text-center text-xs text-white/25 font-display uppercase tracking-widest mb-6">
          Our users got hired at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {["Google","Stripe","Figma","Notion","Anthropic","OpenAI","Vercel","Linear"].map((co) => (
            <span key={co}
              className="font-display font-700 text-base text-white/20 hover:text-white/50 transition-colors duration-200 cursor-default">
              {co}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
