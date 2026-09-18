"use client";

import { useMemo, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { LOME_PLACES } from "@/lib/places";
import { Input } from "./Input";

export function PlaceAutocomplete({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    if (!value) return LOME_PLACES.slice(0, 6);
    return LOME_PLACES.filter((p) => p.toLowerCase().includes(value.toLowerCase())).slice(0, 6);
  }, [value]);

  return (
    <div className="relative" ref={wrapRef}>
      <Input
        label={label}
        icon={<MapPin className="w-4 h-4" />}
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false);
            e.currentTarget.blur();
          }
        }}
        autoComplete="off"
        required
      />
      {open && suggestions.length > 0 && (
        <div className="absolute z-20 mt-1 w-full bg-card rounded-xl shadow-card border border-ink/8 dark:border-white/8 overflow-hidden animate-fade-in origin-top">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(s);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-primary/5 flex items-center gap-2"
            >
              <MapPin className="w-3.5 h-3.5 text-ink/30 dark:text-white/30 shrink-0" />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
