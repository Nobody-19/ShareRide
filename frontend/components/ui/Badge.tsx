import clsx from "clsx";
import { BadgeCheck, Clock, XCircle, ShieldQuestion } from "lucide-react";
import { VerificationStatus } from "@/lib/types";

export function Badge({
  children,
  color = "gray",
  className,
}: {
  children: React.ReactNode;
  color?: "primary" | "secondary" | "success" | "gray" | "red";
  className?: string;
}) {
  const colors = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    success: "bg-success/10 text-success-700 dark:text-success",
    gray: "bg-ink/8 text-ink/60 dark:bg-white/10 dark:text-white/60",
    red: "bg-red-500/10 text-red-500",
  };
  return (
    <span className={clsx("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold", colors[color], className)}>
      {children}
    </span>
  );
}

export function VerifiedBadge({ status, showLabel = true }: { status: VerificationStatus; showLabel?: boolean }) {
  if (status === "verified") {
    return (
      <Badge color="success">
        <BadgeCheck className="w-3.5 h-3.5" />
        {showLabel && "Vérifié"}
      </Badge>
    );
  }
  if (status === "pending") {
    return (
      <Badge color="secondary">
        <Clock className="w-3.5 h-3.5" />
        {showLabel && "En attente"}
      </Badge>
    );
  }
  if (status === "rejected") {
    return (
      <Badge color="red">
        <XCircle className="w-3.5 h-3.5" />
        {showLabel && "Rejeté"}
      </Badge>
    );
  }
  return (
    <Badge color="gray">
      <ShieldQuestion className="w-3.5 h-3.5" />
      {showLabel && "Non vérifié"}
    </Badge>
  );
}
