"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Send, MapPin, Phone, ShieldAlert, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { VerifiedBadge } from "@/components/ui/Badge";
import { RatingModal } from "@/components/rides/RatingModal";
import { AnimatePresence } from "@/components/motion/primitives";
import { api, apiErrorMessage } from "@/lib/api";
import { Ride, Message } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { formatRequestDate } from "@/lib/format";

const QUICK_MESSAGES = ["Prêt(e) ? Je suis devant dans 10min", "J'arrive dans 5 minutes !", "Où es-tu exactement ?"];

export default function ChatPage() {
  const { rideId } = useParams<{ rideId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const [showPhone, setShowPhone] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: ride } = useQuery({
    queryKey: ["ride", rideId],
    queryFn: async () => (await api.get<Ride>(`/rides/${rideId}`)).data,
  });

  const { data: messages } = useQuery({
    queryKey: ["messages", rideId],
    queryFn: async () => (await api.get<Message[]>(`/rides/${rideId}/messages`)).data,
    refetchInterval: 4000,
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length]);

  const sendMutation = useMutation({
    mutationFn: async ({ content, kind }: { content: string; kind?: string }) =>
      (await api.post(`/rides/${rideId}/messages`, { content, kind: kind || "text" })).data,
    onSuccess: () => {
      setText("");
      qc.invalidateQueries({ queryKey: ["messages", rideId] });
    },
  });

  const completeMutation = useMutation({
    mutationFn: async () => (await api.post(`/rides/${rideId}/complete`)).data,
    onSuccess: () => {
      toast.success("Trajet marqué comme terminé");
      qc.invalidateQueries({ queryKey: ["ride", rideId] });
      qc.invalidateQueries({ queryKey: ["rides"] });
      setShowRating(true);
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  function handleShareLocation() {
    if (!navigator.geolocation) {
      sendMutation.mutate({ content: "Position approximative partagée", kind: "location" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        sendMutation.mutate({
          content: `Position partagée (~${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)})`,
          kind: "location",
        });
      },
      () => sendMutation.mutate({ content: "Position approximative partagée", kind: "location" })
    );
  }

  if (!ride) return null;

  return (
    <div className="flex flex-col h-screen">
      <header className="sticky top-0 z-20 bg-card border-b border-ink/6 dark:border-white/6 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full hover:bg-ink/5 dark:hover:bg-white/5 flex items-center justify-center shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <Avatar src={ride.other_user.profile_photo_url} name={ride.other_user.full_name} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="font-bold text-sm truncate">{ride.other_user.full_name}</p>
            <VerifiedBadge status={ride.other_user.verification_status} showLabel={false} />
          </div>
          <p className="text-xs text-ink/45 dark:text-white/45 truncate">
            {ride.request.departure} → {ride.request.destination} · {formatRequestDate(ride.request.date)} {ride.request.time}
          </p>
        </div>
        <button
          onClick={() => toast.error("Alerte SOS envoyée aux contacts d'urgence (démo)")}
          className="w-9 h-9 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shrink-0"
          title="SOS"
        >
          <ShieldAlert className="w-4 h-4" />
        </button>
      </header>

      {ride.status === "upcoming" && (
        <div className="bg-primary/5 border-b border-primary/10 px-4 py-2.5 flex items-center gap-3 flex-wrap">
          <button onClick={() => setShowPhone((s) => !s)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Phone className="w-3.5 h-3.5" />
            {showPhone ? ride.other_user.full_name.split(" ")[0] + " : voir profil" : "Partager mon numéro"}
          </button>
          <span className="text-ink/20 dark:text-white/20">·</span>
          <button onClick={() => completeMutation.mutate()} className="inline-flex items-center gap-1.5 text-xs font-semibold text-success">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Marquer le trajet comme terminé
          </button>
        </div>
      )}

      {ride.status === "completed" && (
        <div className="bg-success/8 border-b border-success/15 px-4 py-2.5 flex items-center justify-between">
          <span className="text-xs font-semibold text-success inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Trajet terminé
          </span>
          <Button size="sm" variant="success" onClick={() => setShowRating(true)}>
            Noter le trajet
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3 scrollbar-none">
        <div className="text-center text-xs text-ink/40 dark:text-white/40 mb-2">
          Covoiturage confirmé pour le {formatRequestDate(ride.request.date)} à {ride.request.time}
        </div>
        {messages?.map((m) => {
          const isMine = m.sender_id === user?.id;
          return (
            <div key={m.id} className={clsx("flex", isMine ? "justify-end" : "justify-start")}>
              <div
                className={clsx(
                  "max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm animate-fade-in",
                  isMine ? "bg-primary text-white rounded-br-sm" : "bg-card border border-ink/6 dark:border-white/6 rounded-bl-sm",
                  m.kind === "location" && "flex items-center gap-1.5"
                )}
              >
                {m.kind === "location" && <MapPin className="w-3.5 h-3.5 shrink-0" />}
                {m.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-none">
        {QUICK_MESSAGES.map((q) => (
          <button
            key={q}
            onClick={() => sendMutation.mutate({ content: q })}
            className="shrink-0 text-xs bg-ink/6 dark:bg-white/8 hover:bg-ink/10 dark:hover:bg-white/12 rounded-full px-3 py-1.5 font-medium whitespace-nowrap"
          >
            {q}
          </button>
        ))}
        <button
          onClick={handleShareLocation}
          className="shrink-0 inline-flex items-center gap-1 text-xs bg-secondary/10 text-secondary hover:bg-secondary/15 rounded-full px-3 py-1.5 font-medium whitespace-nowrap"
        >
          <MapPin className="w-3.5 h-3.5" />
          Partager position
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (text.trim()) sendMutation.mutate({ content: text.trim() });
        }}
        className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] flex items-center gap-2 border-t border-ink/6 dark:border-white/6 bg-card"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Écris un message..."
          className="flex-1 rounded-full border border-ink/12 dark:border-white/12 bg-surface dark:bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        <Button type="submit" size="md" className="!rounded-full !p-2.5" disabled={!text.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </form>

      <AnimatePresence>
        {showRating && (
          <RatingModal
            rideId={rideId}
            otherUserName={ride.other_user.full_name}
            otherUserPhoto={ride.other_user.profile_photo_url}
            onClose={() => setShowRating(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
