import Link from "next/link";
import { MapPin, Clock, Users, ChevronRight, Coins } from "lucide-react";
import { RideRequest } from "@/lib/types";
import { Avatar } from "../ui/Avatar";
import { StarDisplay } from "../ui/StarRating";
import { VerifiedBadge, Badge } from "../ui/Badge";
import { formatRequestDate, formatFCFA } from "@/lib/format";

export function RequestCard({ request }: { request: RideRequest }) {
  return (
    <Link
      href={`/requests/${request.id}`}
      className="group block bg-card rounded-2xl p-4 shadow-soft border border-ink/6 dark:border-white/6 hover:border-primary/30 hover:shadow-card transition-all animate-fade-in"
    >
      <div className="flex items-center gap-3 mb-3.5">
        <Avatar src={request.requester.profile_photo_url} name={request.requester.full_name} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="font-bold text-sm truncate">{request.requester.full_name}</p>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <StarDisplay value={request.requester.rating_avg} count={request.requester.rating_count} size="xs" />
            <VerifiedBadge status={request.requester.verification_status} showLabel={false} />
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-ink/25 dark:text-white/25 group-hover:translate-x-0.5 transition-transform" />
      </div>

      <div className="flex items-center gap-2 text-sm font-semibold mb-2">
        <span className="truncate max-w-[40%]">{request.departure}</span>
        <span className="flex-1 h-px bg-gradient-to-r from-primary/40 to-secondary/40 relative">
          <MapPin className="w-3.5 h-3.5 text-secondary absolute -top-1.5 right-0" />
        </span>
        <span className="truncate max-w-[40%] text-right">{request.destination}</span>
      </div>

      <div className="flex items-center gap-3 text-xs text-ink/50 dark:text-white/50 flex-wrap">
        <span className="inline-flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {formatRequestDate(request.date)}, {request.time}
        </span>
        <span className="inline-flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          {request.seats_needed} place{request.seats_needed > 1 ? "s" : ""}
        </span>
        {request.response_count > 0 && (
          <span className="ml-auto text-primary font-semibold">
            {request.response_count} réponse{request.response_count > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {request.suggested_price != null && (
        <Badge color="success" className="mt-2.5">
          <Coins className="w-3.5 h-3.5" />
          {formatFCFA(request.suggested_price)} — moitié prix du taxi
        </Badge>
      )}

      {request.description && (
        <p className="text-xs text-ink/45 dark:text-white/45 mt-2.5 line-clamp-1 italic">&ldquo;{request.description}&rdquo;</p>
      )}
    </Link>
  );
}
