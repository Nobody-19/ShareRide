import clsx from "clsx";

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx("animate-pulse bg-ink/8 dark:bg-white/8 rounded-lg", className)} />;
}

export function RequestCardSkeleton() {
  return (
    <div className="bg-card dark:bg-card rounded-2xl p-4 shadow-soft border border-ink/6 dark:border-white/6">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="w-11 h-11 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
