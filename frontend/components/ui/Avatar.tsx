import clsx from "clsx";

const COLORS = ["#0066FF", "#FF6B2D", "#00D97E", "#7C3AED", "#EC4899", "#F59E0B"];

function colorFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
}

const sizes = {
  sm: "w-8 h-8 text-xs",
  md: "w-11 h-11 text-sm",
  lg: "w-16 h-16 text-lg",
  xl: "w-24 h-24 text-2xl",
};

export function Avatar({
  src,
  name,
  size = "md",
  className,
}: {
  src?: string | null;
  name: string;
  size?: keyof typeof sizes;
  className?: string;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className={clsx("rounded-full object-cover shrink-0", sizes[size], className)}
      />
    );
  }
  return (
    <div
      className={clsx("rounded-full flex items-center justify-center font-bold text-white shrink-0", sizes[size], className)}
      style={{ backgroundColor: colorFor(name || "?") }}
    >
      {initials(name || "?")}
    </div>
  );
}
