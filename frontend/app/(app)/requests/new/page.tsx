"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Users, Minus, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/Button";
import { Input, TextArea } from "@/components/ui/Input";
import { PlaceAutocomplete } from "@/components/ui/PlaceAutocomplete";
import { api, apiErrorMessage } from "@/lib/api";

export default function NewRequestPage() {
  const router = useRouter();
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("07:00");
  const [seats, setSeats] = useState(1);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/requests", {
        departure,
        destination,
        date,
        time,
        seats_needed: seats,
        description,
      });
      toast.success("Ta requête est en ligne !");
      router.push(`/responses/${data.id}?created=1`);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Impossible de créer la requête"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Topbar title="Nouvelle requête" />
      <div className="p-4 sm:p-6 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6 bg-primary/5 border border-primary/10 rounded-2xl p-4">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <p className="text-sm text-ink/60 dark:text-white/60">
            Les étudiants vérifiés qui vont vers ta destination recevront une notification en temps réel.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-card rounded-2xl p-5 shadow-soft border border-ink/6 dark:border-white/6">
          <PlaceAutocomplete label="Départ" value={departure} onChange={setDeparture} placeholder="Ex: Cité OUA" />
          <PlaceAutocomplete label="Destination" value={destination} onChange={setDestination} placeholder="Ex: Université de Lomé" />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date"
              type="date"
              icon={<Calendar className="w-4 h-4" />}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <Input
              label="Heure de départ"
              type="time"
              icon={<Clock className="w-4 h-4" />}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <div>
            <p className="block text-sm font-medium mb-1.5">Places cherchées</p>
            <div className="flex items-center gap-4 bg-surface dark:bg-white/5 rounded-xl p-2.5">
              <button
                type="button"
                onClick={() => setSeats((s) => Math.max(1, s - 1))}
                className="w-9 h-9 rounded-lg bg-card dark:bg-white/10 flex items-center justify-center shadow-soft"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="flex-1 text-center font-bold flex items-center justify-center gap-2">
                <Users className="w-4 h-4 text-ink/40 dark:text-white/40" />
                {seats}
              </span>
              <button
                type="button"
                onClick={() => setSeats((s) => Math.min(4, s + 1))}
                className="w-9 h-9 rounded-lg bg-card dark:bg-white/10 flex items-center justify-center shadow-soft"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <TextArea
            label="Description (optionnel)"
            placeholder="Ex: Étudiant IPNET, sympa, ponctuel"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button type="submit" fullWidth size="lg" loading={loading} className="!mt-6">
            Poster ma requête
          </Button>
        </form>
      </div>
    </div>
  );
}
