"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Clock, CheckCircle2, PartyPopper, Inbox, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { StarDisplay } from "@/components/ui/StarRating";
import { VerifiedBadge, Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { RequestCardSkeleton } from "@/components/ui/Skeleton";
import { ProfilePreviewModal } from "@/components/profile/ProfilePreviewModal";
import { AnimatePresence } from "@/components/motion/primitives";
import { api, apiErrorMessage } from "@/lib/api";
import { RideRequest, RideResponse, Ride } from "@/lib/types";
import { formatRequestDate } from "@/lib/format";

export default function ResponsesDashboardPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const searchParams = useSearchParams();
  const justCreated = searchParams.get("created") === "1";
  const router = useRouter();
  const qc = useQueryClient();
  const [previewUserId, setPreviewUserId] = useState<string | null>(null);

  const { data: request, isLoading: loadingRequest } = useQuery({
    queryKey: ["request", requestId],
    queryFn: async () => (await api.get<RideRequest>(`/requests/${requestId}`)).data,
  });

  const { data: responses, isLoading: loadingResponses } = useQuery({
    queryKey: ["responses", requestId],
    queryFn: async () => (await api.get<RideResponse[]>(`/requests/${requestId}/responses`)).data,
    refetchInterval: 10_000,
  });

  const { data: rides } = useQuery({
    queryKey: ["rides"],
    queryFn: async () => (await api.get<Ride[]>("/rides")).data,
  });

  const confirmedRide = rides?.find((r) => r.request_id === requestId);

  const confirmMutation = useMutation({
    mutationFn: async (responseId: string) => (await api.post(`/responses/${responseId}/confirm`)).data as Ride,
    onSuccess: (ride) => {
      toast.success("Covoiturage confirmé !");
      qc.invalidateQueries({ queryKey: ["responses", requestId] });
      qc.invalidateQueries({ queryKey: ["request", requestId] });
      qc.invalidateQueries({ queryKey: ["rides"] });
      router.push(`/chat/${ride.id}`);
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const rejectMutation = useMutation({
    mutationFn: async (responseId: string) => (await api.post(`/responses/${responseId}/reject`)).data,
    onSuccess: () => {
      toast.success("Réponse refusée");
      qc.invalidateQueries({ queryKey: ["responses", requestId] });
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  return (
    <div>
      <Topbar title="Réponses à ma requête" />
      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5">
        <button onClick={() => router.push("/dashboard")} className="inline-flex items-center gap-1.5 text-sm text-ink/50 dark:text-white/50 hover:text-primary">
          <ArrowLeft className="w-4 h-4" />
          Retour au dashboard
        </button>

        {justCreated && (
          <div className="flex items-center gap-3 bg-success/8 border border-success/20 rounded-2xl p-4 animate-fade-in">
            <PartyPopper className="w-8 h-8 text-success shrink-0" />
            <div>
              <p className="font-bold text-sm">Ta requête est live !</p>
              <p className="text-xs text-ink/55 dark:text-white/55">
                Les étudiants vérifiés sur ton trajet vont être notifiés. Reviens ici pour voir les réponses.
              </p>
            </div>
          </div>
        )}

        {loadingRequest || !request ? (
          <RequestCardSkeleton />
        ) : (
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-ink/6 dark:border-white/6">
            <div className="flex items-center gap-2 text-sm font-semibold mb-2">
              <span>{request.departure}</span>
              <span className="flex-1 h-px bg-gradient-to-r from-primary/40 to-secondary/40 relative">
                <MapPin className="w-3.5 h-3.5 text-secondary absolute -top-1.5 right-0" />
              </span>
              <span>{request.destination}</span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs text-ink/50 dark:text-white/50">
              <Clock className="w-3.5 h-3.5" />
              {formatRequestDate(request.date)}, {request.time}
            </span>
          </div>
        )}

        {confirmedRide && (
          <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4 flex items-center gap-3">
            <Avatar src={confirmedRide.other_user.profile_photo_url} name={confirmedRide.other_user.full_name} />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-sm">Covoiturage confirmé avec {confirmedRide.other_user.full_name}</p>
              <p className="text-xs text-ink/50 dark:text-white/50">Rejoins le chat pour coordonner le trajet</p>
            </div>
            <Button size="sm" onClick={() => router.push(`/chat/${confirmedRide.id}`)}>
              <MessageCircle className="w-4 h-4" />
              Chat
            </Button>
          </div>
        )}

        <section className="space-y-3">
          <h2 className="font-extrabold text-lg flex items-center gap-2">
            <Inbox className="w-5 h-5 text-primary" />
            Réponses reçues
          </h2>

          {loadingResponses ? (
            <RequestCardSkeleton />
          ) : responses && responses.length > 0 ? (
            <div className="space-y-3">
              {responses.map((resp) => (
                <div key={resp.id} className="bg-card rounded-2xl p-4 shadow-soft border border-ink/6 dark:border-white/6 animate-fade-in">
                  <div className="flex items-start gap-3">
                    <Avatar src={resp.responder.profile_photo_url} name={resp.responder.full_name} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-sm">{resp.responder.full_name}</p>
                        <VerifiedBadge status={resp.responder.verification_status} showLabel={false} />
                      </div>
                      <StarDisplay value={resp.responder.rating_avg} count={resp.responder.rating_count} size="xs" />
                      {resp.message && <p className="text-sm text-ink/55 dark:text-white/55 mt-1.5 italic">&ldquo;{resp.message}&rdquo;</p>}
                    </div>
                    {resp.status === "confirmed" && <Badge color="success">Confirmé</Badge>}
                    {resp.status === "rejected" && <Badge color="gray">Refusé</Badge>}
                  </div>

                  <div className="flex gap-2 mt-3.5">
                    <Button variant="outline" size="sm" fullWidth onClick={() => setPreviewUserId(resp.responder_id)}>
                      Voir profil complet
                    </Button>
                    {resp.status === "pending" && request?.status === "active" && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          fullWidth
                          loading={confirmMutation.isPending}
                          onClick={() => confirmMutation.mutate(resp.id)}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Confirmer
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          loading={rejectMutation.isPending}
                          onClick={() => rejectMutation.mutate(resp.id)}
                          className="text-red-500"
                        >
                          Refuser
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Inbox} title="Pas encore de réponses" description="Les étudiants notifiés apparaîtront ici dès qu'ils répondent." />
          )}
        </section>
      </div>

      <AnimatePresence>
        {previewUserId && <ProfilePreviewModal userId={previewUserId} onClose={() => setPreviewUserId(null)} />}
      </AnimatePresence>
    </div>
  );
}
