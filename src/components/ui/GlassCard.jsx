import React from "react";
import { motion } from "framer-motion";

/**
 * GlassCard
 *
 * Props:
 *  variant   — "default" | "light" | "elevated" | "bordered" | "glow"
 *  padding   — "none" | "sm" | "md" | "lg" | "xl"
 *  hover     — bool  (lift + border-brighten on hover)
 *  animate   — bool  (fade+slide-up entrance animation)
 *  delay     — number (animation delay in seconds)
 *  onClick   — fn
 *  className — string
 *  children  — ReactNode
 */
export default function GlassCard({
  variant   = "default",
  padding   = "md",
  hover     = false,
  animate   = false,
  delay     = 0,
  onClick,
  className = "",
  children,
}) {
  /* ── Padding ─────────────────────────────────────────────────────── */
  const paddings = {
    none: "",
    sm:   "p-4",
    md:   "p-5",
    lg:   "p-6",
    xl:   "p-8",
  };

  /* ── Variant base styles ─────────────────────────────────────────── */
  const variants = {
    default: `
      backdrop-blur-2xl
      bg-[rgba(10,10,28,0.65)]
      border border-white/[.06]
      shadow-[0_0_0_1px_rgba(255,255,255,.04)_inset,0_12px_40px_rgba(0,0,0,.5)]
    `,
    light: `
      backdrop-blur-xl
      bg-white/[.04]
      border border-white/[.08]
      shadow-[0_4px_20px_rgba(0,0,0,.25)]
    `,
    elevated: `
      backdrop-blur-2xl
      bg-[rgba(14,14,35,0.80)]
      border border-white/[.08]
      shadow-[0_24px_64px_rgba(0,0,0,.6),0_0_0_1px_rgba(255,255,255,.06)_inset]
    `,
    bordered: `
      backdrop-blur-xl
      bg-[rgba(10,10,28,0.55)]
      border border-indigo-500/[.22]
      shadow-[0_0_0_1px_rgba(99,102,241,.08)_inset,0_8px_32px_rgba(0,0,0,.4)]
    `,
    glow: `
      backdrop-blur-2xl
      bg-[rgba(12,12,32,0.72)]
      border border-indigo-500/[.25]
      shadow-[0_0_32px_rgba(99,102,241,.18),0_12px_40px_rgba(0,0,0,.5),0_0_0_1px_rgba(99,102,241,.1)_inset]
    `,
  };

  /* ── Hover effect ────────────────────────────────────────────────── */
  const hoverClass = hover
    ? "cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_28px_rgba(99,102,241,.2),0_16px_48px_rgba(0,0,0,.55)] hover:border-indigo-500/20"
    : "";

  /* ── Top-edge shimmer line ───────────────────────────────────────── */
  const Wrapper = animate ? motion.div : "div";
  const motionProps = animate
    ? {
        initial:    { opacity: 0, y: 16 },
        animate:    { opacity: 1, y: 0  },
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay },
      }
    : {};

  return (
    <Wrapper
      {...motionProps}
      onClick={onClick}
      className={`
        relative rounded-2xl overflow-hidden
        ${variants[variant] ?? variants.default}
        ${paddings[padding] ?? paddings.md}
        ${hoverClass}
        ${className}
      `}
    >
      {/* Top-edge accent line */}
      <span
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(99,102,241,.45) 50%, transparent 100%)",
        }}
      />

      {children}
    </Wrapper>
  );
}

/* ── Compound sub-components ──────────────────────────────────────────────── */

GlassCard.Header = function CardHeader({ children, className = "" }) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {children}
    </div>
  );
};

GlassCard.Title = function CardTitle({ children, className = "" }) {
  return (
    <h3 className={`font-display font-700 text-white text-base leading-snug ${className}`}>
      {children}
    </h3>
  );
};

GlassCard.Body = function CardBody({ children, className = "" }) {
  return <div className={`text-sm text-white/60 leading-relaxed ${className}`}>{children}</div>;
};

GlassCard.Footer = function CardFooter({ children, className = "" }) {
  return (
    <div
      className={`mt-4 pt-4 flex items-center gap-3 ${className}`}
      style={{ borderTop: "1px solid rgba(255,255,255,.06)" }}
    >
      {children}
    </div>
  );
};

GlassCard.Divider = function CardDivider({ className = "" }) {
  return (
    <div
      className={`my-4 h-px ${className}`}
      style={{
        background:
          "linear-gradient(90deg, transparent, rgba(255,255,255,.07) 30%, rgba(255,255,255,.07) 70%, transparent)",
      }}
    />
  );
};
