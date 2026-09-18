"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, Car, Bike, Pencil, History } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Avatar } from "@/components/ui/Avatar";
import { StarDisplay } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { DocumentStatusCard } from "@/components/profile/DocumentStatusCard";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { AnimatePresence } from "@/components/motion/primitives";
import { CompletedRideCard } from "@/components/rides/RideCard";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { Ride, Rating } from "@/lib/types";

export default function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);

  const { data: rides } = useQuery({
    queryKey: ["rides"],
    queryFn: async () => (await api.get<Ride[]>("/rides")).data,
  });

  const { data: ratingsReceived } = useQuery({
    queryKey: ["ratings", user?.id],
    queryFn: async () => (await api.get<Rating[]>(`/users/${user!.id}/ratings`)).data,
    enabled: !!user,
  });

  if (!user) return null;
  const completedRides = rides?.filter((r) => r.status === "completed") || [];

  return (
    <div>
      <Topbar title="Mon profil" />
      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5">
        <div className="bg-card rounded-2xl p-6 border border-ink/8">
          <div className="flex items-center gap-4">
            <Avatar src={user.profile_photo_url} name={user.full_name} size="xl" className="ring-2 ring-primary/15" />
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-xl truncate text-ink">{user.full_name}</h2>
              {user.university && (
                <span className="inline-flex items-center gap-1 text-sm text-ink/50 mt-0.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {user.university}
                </span>
              )}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <StarDisplay value={user.rating_avg} count={user.rating_count} />
                {user.vehicle_type !== "aucun" && (
                  <span className="inline-flex items-center gap-1 text-xs bg-ink/6 text-ink/60 px-2.5 py-1 rounded-full font-semibold">
                    {user.vehicle_type === "voiture" ? <Car className="w-3.5 h-3.5" /> : <Bike className="w-3.5 h-3.5" />}
                    {user.vehicle_type === "voiture" ? "Voiture" : "Moto"}
                  </span>
                )}
              </div>
            </div>
          </div>
          {user.bio && <p className="text-sm text-ink/60 mt-4">{user.bio}</p>}
          <Button variant="outline" size="sm" className="mt-4" onClick={() => setEditing(true)}>
            <Pencil className="w-3.5 h-3.5" />
            Modifier profil
          </Button>
        </div>

        <DocumentStatusCard user={user} />

        <section className="space-y-3">
          <h3 className="font-extrabold text-lg flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Mes trajets complétés
          </h3>
          {completedRides.length > 0 ? (
            <div className="space-y-3">
              {completedRides.map((ride) => {
                const rating = ratingsReceived?.find((r) => r.ride_id === ride.id);
                return <CompletedRideCard key={ride.id} ride={ride} rating={rating ? { stars: rating.stars, comment: rating.comment } : null} />;
              })}
            </div>
          ) : (
            <EmptyState icon={History} title="Aucun trajet terminé" description="Ton historique de covoiturage apparaîtra ici." />
          )}
        </section>
      </div>

      <AnimatePresence>{editing && <EditProfileModal user={user} onClose={() => setEditing(false)} />}</AnimatePresence>
    </div>
  );
}
