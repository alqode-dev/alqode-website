import type { ReactNode } from "react";

/**
 * MonoTag — terminal-style metadata label.
 * Used for technical metadata, paths, status counters.
 *
 *   <MonoTag>deployed → 2024</MonoTag>  →  rendered in JetBrains Mono, muted, tracked
 */
export function MonoTag({
  children,
  className = "",
  variant = "muted",
}: {
  children: ReactNode;
  className?: string;
  variant?: "muted" | "terminal" | "amber" | "white";
}) {
  const colorClass =
    variant === "terminal"
      ? "text-terminal"
      : variant === "amber"
      ? "text-live-amber"
      : variant === "white"
      ? "text-white/85"
      : "text-muted";

  return (
    <span
      className={`inline-block font-mono text-[10px] md:text-[11px] tracking-[1px] uppercase ${colorClass} ${className}`}
    >
      {children}
    </span>
  );
}
