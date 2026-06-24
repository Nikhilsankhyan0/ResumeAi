import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

/**
 * GradientButton
 *
 * Props:
 *  variant  — "primary" | "secondary" | "ghost" | "outline" | "danger"
 *  size     — "sm" | "md" | "lg" | "xl"
 *  loading  — bool
 *  disabled — bool
 *  icon     — ReactNode (left icon)
 *  iconRight— ReactNode (right icon)
 *  glow     — bool (extra glow ring on hover)
 *  full     — bool (w-full)
 *  onClick  — fn
 *  type     — "button" | "submit"
 *  children — ReactNode
 */
export default function GradientButton({
  variant   = "primary",
  size      = "md",
  loading   = false,
  disabled  = false,
  icon,
  iconRight,
  glow      = false,
  full      = false,
  onClick,
  type      = "button",
  className = "",
  children,
}) {
  const isDisabled = disabled || loading;

  /* ── Size tokens ─────────────────────────────────────────────────── */
  const sizes = {
    sm:  "px-4   py-2    text-xs  gap-1.5 rounded-lg",
    md:  "px-5   py-2.5  text-sm  gap-2   rounded-xl",
    lg:  "px-7   py-3    text-sm  gap-2   rounded-xl",
    xl:  "px-9   py-3.5  text-base gap-2.5 rounded-2xl",
  };

  /* ── Variant styles ─────────────────────────────────────────────── */
  const base = `
    relative inline-flex items-center justify-center
    font-display font-600 whitespace-nowrap
    transition-all duration-300 select-none
    ${full ? "w-full" : ""}
    ${sizes[size] ?? sizes.md}
    ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
  `;

  const variants = {
    primary: `
      text-white border border-white/10
      bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700
      shadow-[0_0_22px_rgba(99,102,241,.35),0_1px_0_rgba(255,255,255,.12)_inset]
    `,
    secondary: `
      text-white/80 border border-white/10
      bg-white/[.04]
      hover:bg-indigo-500/10 hover:border-indigo-500/35 hover:text-white
    `,
    ghost: `
      text-white/55 border border-transparent
      bg-transparent
      hover:text-white hover:bg-white/[.05]
    `,
    outline: `
      text-indigo-300 border border-indigo-500/40
      bg-indigo-500/[.06]
      hover:bg-indigo-500/12 hover:border-indigo-500/60 hover:text-indigo-200
    `,
    danger: `
      text-white border border-rose-500/20
      bg-gradient-to-br from-rose-600 to-rose-700
      shadow-[0_0_20px_rgba(244,63,94,.25)]
    `,
  };

  /* ── Glow ring (primary only) ───────────────────────────────────── */
  const glowClass =
    glow && variant === "primary" && !isDisabled
      ? "after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] after:blur-xl after:opacity-0 after:bg-gradient-to-br after:from-indigo-500 after:via-violet-600 after:to-purple-700 hover:after:opacity-60 after:transition-opacity after:duration-300 overflow-visible"
      : "";

  return (
    <motion.button
      type={type}
      onClick={!isDisabled ? onClick : undefined}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: variant === "primary" ? 1.03 : 1.01, y: -1 } : {}}
      whileTap={!isDisabled  ? { scale: 0.97, y: 0 }                           : {}}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={`${base} ${variants[variant] ?? variants.primary} ${glowClass} ${className}`}
    >
      {/* Shimmer overlay on primary */}
      {variant === "primary" && !isDisabled && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none"
        >
          <span className="absolute inset-0 -translate-x-full hover:translate-x-full
            bg-gradient-to-r from-transparent via-white/10 to-transparent
            transition-transform duration-700 ease-in-out" />
        </span>
      )}

      {/* Left icon / spinner */}
      {loading ? (
        <Loader2 size={14} className="animate-spin flex-shrink-0" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}

      {children && <span>{children}</span>}

      {/* Right icon */}
      {!loading && iconRight && (
        <span className="flex-shrink-0">{iconRight}</span>
      )}
    </motion.button>
  );
}
