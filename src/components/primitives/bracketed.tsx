import type { ReactNode } from "react";

/**
 * Bracketed — wraps children with terminal-green {alqode}-style brackets.
 * Used to add structural framing around section labels, status pills, metadata.
 *
 * Example:
 *   <Bracketed>live since 2024</Bracketed>  →  { live since 2024 }
 */
export function Bracketed({
  children,
  className = "",
  tight = false,
}: {
  children: ReactNode;
  className?: string;
  tight?: boolean;
}) {
  return (
    <span className={`inline-flex items-center ${tight ? "gap-0.5" : "gap-1.5"} ${className}`}>
      <span className="text-terminal font-mono font-semibold leading-none">{"{"}</span>
      <span className="leading-none">{children}</span>
      <span className="text-terminal font-mono font-semibold leading-none">{"}"}</span>
    </span>
  );
}
