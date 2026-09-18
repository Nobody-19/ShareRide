"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle, Star, CheckCircle2, Radar, AlertTriangle, Car } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { MyRequestCard } from "@/components/requests/MyRequestCard";
import { RideCard } from "@/components/rides/RideCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { RequestCardSkeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { RideRequest, Ride } from "@/lib/types";

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: myRequests, isLoading: loadingRequests } = useQuery({
    queryKey: ["requests", "mine"],
    queryFn: async () => (await api.get<RideRequest[]>("/requests", { params: { mine: true, status: "active" } })).data,
  });

  const { data: rides } = useQuery({
    queryKey: ["rides"],
    queryFn: async () => (await api.get<Ride[]>("/rides")).data,
  });

  const upcomingRides = rides?.filter((r) => r.status === "upcoming") || [];
  const completedRides = rides?.filter((r) => r.status === "completed") || [];

  return (
    <div>
      <Topbar title={`Salut, ${user?.full_name.split(" ")[0]}`} />

      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-7">
        {user && user.verification_status !== "verified" && (
          <div className="flex items-center gap-3 bg-secondary/8 border border-secondary/20 rounded-2xl p-4 animate-fade-in">
            <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-secondary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-sm">
                {user.verification_status === "pending" ? "Vérification en cours" : "Compte non vérifié"}
              </p>
              <p className="text-xs text-ink/55 dark:text-white/55">
                {user.verification_status === "pending"
                  ? "Tes documents sont en cours de vérification, ça prend juste quelques instants."
                  : "Soumets tes documents pour débloquer toutes les fonctionnalités."}
              </p>
            </div>
            {user.verification_status === "unsubmitted" && (
              <Link href="/profile">
                <Button size="sm" variant="secondary">
                  Vérifier
                </Button>
              </Link>
            )}
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={Star} label="Note moyenne" value={user?.rating_avg ? user.rating_avg.toFixed(1) : "—"} color="secondary" />
          <StatCard icon={CheckCircle2} label="Trajets faits" value={completedRides.length} color="success" />
          <StatCard icon={Radar} label="Requêtes actives" value={myRequests?.length || 0} color="primary" />
        </div>

        {upcomingRides.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-extrabold text-lg">Trajets confirmés</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {upcomingRides.map((ride) => (
                <RideCard key={ride.id} ride={ride} />
              ))}
            </div>
          </section>
        )}

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-lg">Mes requêtes</h2>
            <Link href="/requests/new">
              <Button size="sm" variant="outline">
                <PlusCircle className="w-4 h-4" />
                Nouvelle requête
              </Button>
            </Link>
          </div>

          {loadingRequests ? (
            <div className="grid sm:grid-cols-2 gap-3">
              <RequestCardSkeleton />
              <RequestCardSkeleton />
            </div>
          ) : myRequests && myRequests.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-3">
              {myRequests.map((r) => (
                <MyRequestCard key={r.id} request={r} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Car}
              title="Aucune requête active"
              description="Poste une requête pour trouver un covoiturage vers ton campus."
              action={
                <Link href="/requests/new">
                  <Button>
                    <PlusCircle className="w-4 h-4" />
                    Poster ma requête
                  </Button>
                </Link>
              }
            />
          )}
        </section>
      </div>
    </div>
  );
}
