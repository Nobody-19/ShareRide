"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Clock, Users, GraduationCap, MessageSquareHeart, ArrowLeft, HandHeart } from "lucide-react";
import { toast } from "sonner";
import { Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { StarDisplay } from "@/components/ui/StarRating";
import { VerifiedBadge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { api, apiErrorMessage } from "@/lib/api";
import { RideRequest, Rating } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { formatRequestDate } from "@/lib/format";

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [message, setMessage] = useState("");
  const [showMessageBox, setShowMessageBox] = useState(false);

  const { data: request, isLoading } = useQuery({
    queryKey: ["request", id],
    queryFn: async () => (await api.get<RideRequest>(`/requests/${id}`)).data,
  });

  const { data: ratings } = useQuery({
    queryKey: ["ratings", request?.requester_id],
    queryFn: async () => (await api.get<Rating[]>(`/users/${request!.requester_id}/ratings`)).data,
    enabled: !!request,
  });

  const respondMutation = useMutation({
    mutationFn: async () => (await api.post(`/requests/${id}/respond`, { message })).data,
    onSuccess: () => {
      toast.success("Ta réponse a été envoyée !");
      qc.invalidateQueries({ queryKey: ["requests"] });
      router.push("/requests");
    },
    onError: (err) => toast.error(apiErrorMessage(err, "Impossible de répondre")),
  });

  if (isLoading || !request) {
    return (
      <div>
        <Topbar title="Détails de la requête" />
        <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const isOwner = user?.id === request.requester_id;

  return (
    <div>
      <Topbar title="Détails de la requête" />
      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4">
        <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-sm text-ink/50 dark:text-white/50 hover:text-primary">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        <div className="bg-card rounded-2xl p-5 shadow-soft border border-ink/6 dark:border-white/6 animate-fade-in">
          <div className="flex items-center gap-4">
            <Avatar src={request.requester.profile_photo_url} name={request.requester.full_name} size="lg" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-extrabold text-lg">{request.requester.full_name}</h2>
                <VerifiedBadge status={request.requester.verification_status} />
              </div>
              <div className="flex items-center gap-3 mt-1">
                <StarDisplay value={request.requester.rating_avg} count={request.requester.rating_count} />
                {request.requester.university && (
                  <span className="inline-flex items-center gap-1 text-xs text-ink/50 dark:text-white/50">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {request.requester.university}
                  </span>
                )}
              </div>
            </div>
          </div>
          {request.requester.bio && (
            <p className="text-sm text-ink/60 dark:text-white/60 mt-4 bg-surface dark:bg-white/5 rounded-xl p-3">{request.requester.bio}</p>
          )}
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-soft border border-ink/6 dark:border-white/6 space-y-3.5">
          <h3 className="font-bold">Détails du trajet</h3>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span>{request.departure}</span>
            <span className="flex-1 h-px bg-gradient-to-r from-primary/40 to-secondary/40 relative">
              <MapPin className="w-3.5 h-3.5 text-secondary absolute -top-1.5 right-0" />
            </span>
            <span>{request.destination}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-ink/60 dark:text-white/60">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {formatRequestDate(request.date)}, {request.time}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              {request.seats_needed} place{request.seats_needed > 1 ? "s" : ""} cherchée{request.seats_needed > 1 ? "s" : ""}
            </span>
          </div>
          {request.description && (
            <p className="text-sm text-ink/60 dark:text-white/60 italic bg-surface dark:bg-white/5 rounded-xl p-3">
              &ldquo;{request.description}&rdquo;
            </p>
          )}
        </div>

        {ratings && ratings.length > 0 && (
          <div className="bg-card rounded-2xl p-5 shadow-soft border border-ink/6 dark:border-white/6 space-y-3">
            <h3 className="font-bold">Avis reçus</h3>
            {ratings.slice(0, 3).map((r) => (
              <div key={r.id} className="flex items-start gap-2 text-sm">
                <StarDisplay value={r.stars} size="xs" />
                <p className="text-ink/55 dark:text-white/55 italic">&ldquo;{r.comment}&rdquo;</p>
              </div>
            ))}
          </div>
        )}

        {!isOwner && request.status === "active" && (
          <div className="bg-card rounded-2xl p-5 shadow-soft border border-ink/6 dark:border-white/6 space-y-3 sticky bottom-4">
            {showMessageBox && (
              <TextArea
                placeholder="Ajoute un petit mot (optionnel)"
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            )}
            <div className="flex gap-2">
              {!showMessageBox && (
                <Button variant="outline" onClick={() => setShowMessageBox(true)} className="shrink-0">
                  <MessageSquareHeart className="w-4 h-4" />
                </Button>
              )}
              <Button variant="success" fullWidth size="lg" loading={respondMutation.isPending} onClick={() => respondMutation.mutate()}>
                <HandHeart className="w-4 h-4" />
                Je peux t&apos;aider
              </Button>
            </div>
          </div>
        )}

        {isOwner && (
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 text-sm text-center text-primary font-semibold">
            C&apos;est ta requête — consulte les réponses depuis ton dashboard.
          </div>
        )}
      </div>
    </div>
  );
}
