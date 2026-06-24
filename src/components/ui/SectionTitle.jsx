import React from "react";
import { motion } from "framer-motion";

/**
 * SectionTitle
 *
 * Props:
 *  eyebrow    — string   (small label above heading)
 *  title      — string | ReactNode
 *  highlight  — string   (word(s) inside title to gradient-colorize)
 *  subtitle   — string | ReactNode
 *  align      — "left" | "center" | "right"
 *  size       — "sm" | "md" | "lg" | "xl"
 *  animate    — bool
 *  delay      — number (seconds)
 *  className  — string
 */
export default function SectionTitle({
  eyebrow,
  title,
  highlight,
  subtitle,
  align     = "left",
  size      = "md",
  animate   = true,
  delay     = 0,
  className = "",
}) {
  /* ── Alignment ───────────────────────────────────────────────────── */
  const alignClass = {
    left:   "items-start text-left",
    center: "items-center text-center",
    right:  "items-end text-right",
  }[align] ?? "items-start text-left";

  /* ── Heading sizes ───────────────────────────────────────────────── */
  const headingSizes = {
    sm: "text-xl  sm:text-2xl",
    md: "text-2xl sm:text-3xl",
    lg: "text-3xl sm:text-4xl",
    xl: "text-4xl sm:text-5xl lg:text-6xl",
  };

  /* ── Inject gradient highlight ───────────────────────────────────── */
  function renderTitle() {
    if (!highlight || typeof title !== "string") return title;
    const parts = title.split(highlight);
    return (
      <>
        {parts[0]}
        <span className="gradient-text">{highlight}</span>
        {parts[1]}
      </>
    );
  }

  /* ── Animation variants ──────────────────────────────────────────── */
  const container = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.1, delayChildren: delay } },
  };
  const item = {
    hidden: { opacity: 0, y: 14 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  const Wrapper = animate ? motion.div : "div";
  const Item    = animate ? motion.div : "div";

  const wrapperProps = animate
    ? { variants: container, initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-60px" } }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`flex flex-col gap-3 ${alignClass} ${className}`}
    >
      {/* Eyebrow */}
      {eyebrow && (
        <Item {...(animate ? { variants: item } : {})}>
          <span className="badge-indigo font-display text-xs tracking-widest uppercase">
            {eyebrow}
          </span>
        </Item>
      )}

      {/* Heading */}
      <Item {...(animate ? { variants: item } : {})}>
        <h2
          className={`
            font-display font-800 leading-[1.15] tracking-tight text-white
            ${headingSizes[size] ?? headingSizes.md}
          `}
        >
          {renderTitle()}
        </h2>
      </Item>

      {/* Subtitle */}
      {subtitle && (
        <Item {...(animate ? { variants: item } : {})}>
          <p
            className={`
              font-body text-white/55 leading-relaxed max-w-2xl
              ${size === "xl" ? "text-lg" : size === "lg" ? "text-base" : "text-sm"}
            `}
          >
            {subtitle}
          </p>
        </Item>
      )}

      {/* Decorative line — only on left/right aligned */}
      {align !== "center" && (
        <Item {...(animate ? { variants: item } : {})}>
          <div
            className="h-0.5 w-12 rounded-full mt-1"
            style={{ background: "linear-gradient(90deg,#4f46e5,#8b5cf6)" }}
          />
        </Item>
      )}
    </Wrapper>
  );
}
