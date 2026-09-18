"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal, PlusCircle, X, Search } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RequestCard } from "@/components/requests/RequestCard";
import { RequestCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { api } from "@/lib/api";
import { RideRequest } from "@/lib/types";

export default function RequestsFeedPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const { data: requests, isLoading } = useQuery({
    queryKey: ["requests", "feed", departure, destination, date, time],
    queryFn: async () =>
      (
        await api.get<RideRequest[]>("/requests", {
          params: {
            departure: departure || undefined,
            destination: destination || undefined,
            date: date || undefined,
            time: time || undefined,
          },
        })
      ).data,
  });

  const hasFilters = departure || destination || date || time;

  return (
    <div>
      <Topbar title="Trajets disponibles" />

      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilters((s) => !s)}>
            <SlidersHorizontal className="w-4 h-4" />
            Filtres {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
          </Button>
          <Link href="/requests/new" className="ml-auto">
            <Button size="sm">
              <PlusCircle className="w-4 h-4" />
              Poster
            </Button>
          </Link>
        </div>

        {showFilters && (
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-ink/6 dark:border-white/6 animate-rise-in">
            <div className="grid sm:grid-cols-2 gap-3">
              <Input label="Départ" placeholder="Ex: Cité" value={departure} onChange={(e) => setDeparture(e.target.value)} icon={<Search className="w-4 h-4" />} />
              <Input label="Destination" placeholder="Ex: Université de Lomé" value={destination} onChange={(e) => setDestination(e.target.value)} icon={<Search className="w-4 h-4" />} />
              <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              <Input label="Horaire (±30min)" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
            {hasFilters && (
              <button
                onClick={() => {
                  setDeparture("");
                  setDestination("");
                  setDate("");
                  setTime("");
                }}
                className="mt-3 text-xs text-red-500 font-semibold inline-flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="grid sm:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <RequestCardSkeleton key={i} />
            ))}
          </div>
        ) : requests && requests.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-3">
            {requests.map((r) => (
              <RequestCard key={r.id} request={r} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="Aucun trajet trouvé"
            description="Essaie de modifier tes filtres, ou reviens plus tard."
          />
        )}
      </div>
    </div>
  );
}
