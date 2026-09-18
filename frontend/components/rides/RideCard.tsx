import Link from "next/link";
import { MapPin, MessageCircle } from "lucide-react";
import { Ride } from "@/lib/types";
import { Avatar } from "../ui/Avatar";
import { StarDisplay } from "../ui/StarRating";
import { formatRequestDate } from "@/lib/format";

export function RideCard({ ride }: { ride: Ride }) {
  return (
    <Link
      href={`/chat/${ride.id}`}
      className="group flex items-center gap-3 bg-card rounded-2xl p-4 shadow-soft border border-ink/6 dark:border-white/6 hover:border-primary/30 hover:shadow-card transition-all animate-fade-in"
    >
      <Avatar src={ride.other_user.profile_photo_url} name={ride.other_user.full_name} size="md" />
      <div className="min-w-0 flex-1">
        <p className="font-bold text-sm truncate">{ride.other_user.full_name}</p>
        <div className="flex items-center gap-1 text-xs text-ink/50 dark:text-white/50 mt-0.5 truncate">
          <MapPin className="w-3 h-3 shrink-0" />
          {ride.request.departure} → {ride.request.destination}
        </div>
        <p className="text-[11px] text-ink/40 dark:text-white/40 mt-0.5">
          {formatRequestDate(ride.request.date)}, {ride.request.time}
        </p>
      </div>
      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <MessageCircle className="w-4 h-4" />
      </div>
    </Link>
  );
}

export function CompletedRideCard({ ride, rating }: { ride: Ride; rating?: { stars: number; comment: string } | null }) {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-soft border border-ink/6 dark:border-white/6">
      <div className="flex items-center gap-3">
        <Avatar src={ride.other_user.profile_photo_url} name={ride.other_user.full_name} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-sm truncate">{ride.other_user.full_name}</p>
          <p className="text-xs text-ink/50 dark:text-white/50 truncate">
            {ride.request.departure} → {ride.request.destination}
          </p>
        </div>
        {rating && <StarDisplay value={rating.stars} size="sm" />}
      </div>
      {rating?.comment && <p className="text-xs text-ink/50 dark:text-white/50 mt-2.5 italic">&ldquo;{rating.comment}&rdquo;</p>}
    </div>
  );
}
