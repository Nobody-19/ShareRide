"use client";

import { useQuery } from "@tanstack/react-query";
import { X, GraduationCap, Car, Bike } from "lucide-react";
import { api } from "@/lib/api";
import { UserPublic, Rating } from "@/lib/types";
import { Avatar } from "../ui/Avatar";
import { StarDisplay } from "../ui/StarRating";
import { VerifiedBadge } from "../ui/Badge";
import { Skeleton } from "../ui/Skeleton";
import { motion, overlayFade, sheetUp } from "../motion/primitives";

export function ProfilePreviewModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => (await api.get<UserPublic>(`/users/${userId}`)).data,
  });
  const { data: ratings } = useQuery({
    queryKey: ["ratings", userId],
    queryFn: async () => (await api.get<Rating[]>(`/users/${userId}/ratings`)).data,
  });

  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit="exit"
      variants={overlayFade}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        variants={sheetUp}
        className="bg-card w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-card flex justify-end p-3 border-b border-ink/6">
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-ink/5 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isLoading || !profile ? (
          <div className="p-6 space-y-4">
            <Skeleton className="w-20 h-20 rounded-full mx-auto" />
            <Skeleton className="h-4 w-40 mx-auto" />
          </div>
        ) : (
          <div className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar src={profile.profile_photo_url} name={profile.full_name} size="xl" />
              <h2 className="font-extrabold text-xl mt-3">{profile.full_name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <VerifiedBadge status={profile.verification_status} />
                {profile.vehicle_type !== "aucun" && (
                  <span className="inline-flex items-center gap-1 text-xs bg-ink/8 dark:bg-white/10 px-2.5 py-1 rounded-full font-semibold">
                    {profile.vehicle_type === "voiture" ? <Car className="w-3.5 h-3.5" /> : <Bike className="w-3.5 h-3.5" />}
                    {profile.vehicle_type === "voiture" ? "Voiture" : "Moto"}
                  </span>
                )}
              </div>
              <div className="mt-3">
                <StarDisplay value={profile.rating_avg} count={profile.rating_count} size="md" />
              </div>
              {profile.university && (
                <span className="inline-flex items-center gap-1 text-sm text-ink/50 dark:text-white/50 mt-2">
                  <GraduationCap className="w-4 h-4" />
                  {profile.university}
                </span>
              )}
              {profile.bio && <p className="text-sm text-ink/60 dark:text-white/60 mt-4">{profile.bio}</p>}
            </div>

            {ratings && ratings.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="font-bold text-sm">Avis ({ratings.length})</h3>
                {ratings.map((r) => (
                  <div key={r.id} className="bg-surface dark:bg-white/5 rounded-xl p-3">
                    <StarDisplay value={r.stars} size="xs" />
                    {r.comment && <p className="text-sm text-ink/60 dark:text-white/60 mt-1">&ldquo;{r.comment}&rdquo;</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
