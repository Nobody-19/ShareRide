import { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-primary/8 flex items-center justify-center mb-4">
        <Icon className="w-9 h-9 text-primary" strokeWidth={1.5} />
      </div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      {description && <p className="text-sm text-ink/50 dark:text-white/50 max-w-xs mb-5">{description}</p>}
      {action}
    </div>
  );
}
