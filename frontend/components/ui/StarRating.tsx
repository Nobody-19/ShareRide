"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import clsx from "clsx";

export function StarDisplay({ value, count, size = "sm" }: { value: number; count?: number; size?: "xs" | "sm" | "md" }) {
  const px = { xs: 12, sm: 14, md: 18 }[size];
  return (
    <div className="inline-flex items-center gap-1">
      <Star size={px} className="fill-secondary text-secondary" />
      <span className={clsx("font-semibold", size === "md" ? "text-base" : "text-sm")}>{value.toFixed(1)}</span>
      {typeof count === "number" && <span className="text-ink/40 dark:text-white/40 text-xs">({count})</span>}
    </div>
  );
}

export function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform active:scale-90"
        >
          <Star
            size={32}
            className={clsx(
              (hover || value) >= i ? "fill-secondary text-secondary" : "fill-transparent text-ink/20 dark:text-white/20"
            )}
          />
        </button>
      ))}
    </div>
  );
}
