import { LucideIcon } from "lucide-react";
import clsx from "clsx";

export function StatCard({
  icon: Icon,
  label,
  value,
  color = "primary",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: "primary" | "secondary" | "success";
}) {
  const colors = {
    primary: "text-primary",
    secondary: "text-secondary",
    success: "text-success-600",
  };
  return (
    <div className="bg-card rounded-xl p-3.5 sm:p-4 border border-ink/8">
      <div className={clsx("flex items-center gap-1.5 mb-2", colors[color])}>
        <Icon className="w-3.5 h-3.5" strokeWidth={2.25} />
        <p className="text-[11px] font-semibold text-ink/45 leading-tight">{label}</p>
      </div>
      <p className="text-xl sm:text-2xl font-extrabold leading-tight text-ink tabular-nums">{value}</p>
    </div>
  );
}
