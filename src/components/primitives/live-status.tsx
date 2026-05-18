import type { ReactNode } from "react";

type Variant = "live" | "active" | "alert" | "ok";

const VARIANT_STYLES: Record<Variant, { dot: string; text: string }> = {
  live: { dot: "bg-terminal", text: "text-terminal" },
  active: { dot: "bg-live-amber", text: "text-live-amber" },
  alert: { dot: "bg-signal-red", text: "text-signal-red" },
  ok: { dot: "bg-terminal/70", text: "text-muted" },
};

/**
 * LiveStatus — pulsing dot + small mono label.
 * Used to indicate state on cards, sections, hero.
 *
 *   <LiveStatus variant="live">accepting projects</LiveStatus>
 */
export function LiveStatus({
  variant = "live",
  children,
  className = "",
  size = "sm",
}: {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  size?: "xs" | "sm" | "md";
}) {
  const styles = VARIANT_STYLES[variant];
  const sizeText = size === "xs" ? "text-[10px]" : size === "md" ? "text-sm" : "text-xs";
  const dotSize = size === "xs" ? "h-1.5 w-1.5" : size === "md" ? "h-2.5 w-2.5" : "h-2 w-2";

  return (
    <span
      className={`inline-flex items-center gap-2 font-mono ${sizeText} ${styles.text} ${className}`}
    >
      <span className={`relative inline-flex items-center justify-center flex-shrink-0 ${dotSize}`} aria-hidden="true">
        {/* Big halo pulse — origin-center scale */}
        <span
          className={`absolute inset-0 rounded-full ${styles.dot} animate-live-pulse`}
          style={{ transformOrigin: "center" }}
        />
        {/* Solid center dot */}
        <span className={`relative inline-block rounded-full ${styles.dot} ${dotSize}`} />
      </span>
      <span className="leading-none">{children}</span>
    </span>
  );
}
