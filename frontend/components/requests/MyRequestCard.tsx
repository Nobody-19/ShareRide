import Link from "next/link";
import { MapPin, Clock, Users, Inbox } from "lucide-react";
import { RideRequest } from "@/lib/types";
import { Badge } from "../ui/Badge";
import { formatRequestDate } from "@/lib/format";

const STATUS_LABEL: Record<string, { label: string; color: "primary" | "secondary" | "success" | "gray" }> = {
  active: { label: "Active", color: "success" },
  matched: { label: "Confirmée", color: "primary" },
  completed: { label: "Terminée", color: "gray" },
  cancelled: { label: "Annulée", color: "gray" },
};

export function MyRequestCard({ request }: { request: RideRequest }) {
  const status = STATUS_LABEL[request.status] || STATUS_LABEL.active;

  return (
    <Link
      href={`/responses/${request.id}`}
      className="group block bg-card rounded-2xl p-4 shadow-soft border border-ink/6 dark:border-white/6 hover:border-primary/30 hover:shadow-card transition-all animate-fade-in"
    >
      <div className="flex items-center justify-between mb-3">
        <Badge color={status.color}>{status.label}</Badge>
        {request.response_count > 0 && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
            <Inbox className="w-3.5 h-3.5" />
            {request.response_count} réponse{request.response_count > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm font-semibold mb-2">
        <span className="truncate max-w-[40%]">{request.departure}</span>
        <span className="flex-1 h-px bg-gradient-to-r from-primary/40 to-secondary/40 relative">
          <MapPin className="w-3.5 h-3.5 text-secondary absolute -top-1.5 right-0" />
        </span>
        <span className="truncate max-w-[40%] text-right">{request.destination}</span>
      </div>

      <div className="flex items-center gap-3 text-xs text-ink/50 dark:text-white/50">
        <span className="inline-flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {formatRequestDate(request.date)}, {request.time}
        </span>
        <span className="inline-flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          {request.seats_needed} place{request.seats_needed > 1 ? "s" : ""}
        </span>
      </div>
    </Link>
  );
}
