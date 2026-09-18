import { SVGProps } from "react";

/**
 * Brand mark: a graduation cap over motion lines — student + ride, in one
 * connected silhouette. Built for currentColor so it drops into any badge
 * (white-on-primary, primary-on-surface, etc.) and stays legible down to
 * favicon size since it has no fine internal detail.
 */
export function LogoMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2.5L21 7L12 11.5L3 7L12 2.5Z" fill="currentColor" />
      <rect x="8.25" y="9.5" width="7.5" height="2.75" rx="1.1" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="2.5" y1="15" x2="10.5" y2="15" opacity="1" />
        <line x1="5.5" y1="18.2" x2="15.5" y2="18.2" opacity="0.7" />
        <line x1="9" y1="21.4" x2="21" y2="21.4" opacity="0.42" />
      </g>
    </svg>
  );
}

export function LogoBadge({ className, tone = "solid" }: { className?: string; tone?: "solid" | "tint" | "dark" }) {
  const bg = tone === "solid" ? "bg-primary" : tone === "dark" ? "bg-white/10" : "bg-primary/10";
  const fg = tone === "tint" ? "text-primary" : "text-white";
  return (
    <div className={`rounded-lg flex items-center justify-center shrink-0 ${bg} ${className || "w-8 h-8"}`}>
      <LogoMark className={`${fg} w-1/2 h-1/2`} />
    </div>
  );
}
