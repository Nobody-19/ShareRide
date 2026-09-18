"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { X, Car, Bike, Ban } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";
import { User, VehicleType } from "@/lib/types";
import { api, apiErrorMessage } from "@/lib/api";
import { Button } from "../ui/Button";
import { Input, TextArea } from "../ui/Input";
import { FileUpload } from "../ui/FileUpload";
import { useAuth } from "@/lib/auth-context";
import { motion, overlayFade, sheetUp } from "../motion/primitives";

const VEHICLES: { value: VehicleType; label: string; icon: typeof Car }[] = [
  { value: "aucun", label: "Aucun", icon: Ban },
  { value: "moto", label: "Moto", icon: Bike },
  { value: "voiture", label: "Voiture", icon: Car },
];

export function EditProfileModal({ user, onClose }: { user: User; onClose: () => void }) {
  const { setUser } = useAuth();
  const [form, setForm] = useState({
    full_name: user.full_name,
    phone: user.phone,
    bio: user.bio,
    university: user.university || "",
    vehicle_type: user.vehicle_type,
    profile_photo_url: user.profile_photo_url || "",
  });

  const mutation = useMutation({
    mutationFn: async () => (await api.put("/users/me", form)).data,
    onSuccess: (data) => {
      setUser(data);
      toast.success("Profil mis à jour");
      onClose();
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
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
        className="bg-card w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-card flex items-center justify-between px-5 py-3.5 border-b border-ink/6">
          <h3 className="font-bold">Modifier le profil</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-ink/5 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <FileUpload
            label="Photo de profil"
            rounded
            value={form.profile_photo_url}
            onChange={(url) => setForm({ ...form, profile_photo_url: url })}
          />
          <Input label="Nom complet" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          <Input label="Téléphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Université" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} />
          <TextArea label="Bio" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />

          <div>
            <p className="block text-sm font-medium mb-1.5">Véhicule</p>
            <div className="grid grid-cols-3 gap-2">
              {VEHICLES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm({ ...form, vehicle_type: value })}
                  className={clsx(
                    "flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-colors",
                    form.vehicle_type === value ? "border-primary bg-primary/5" : "border-ink/10 dark:border-white/10"
                  )}
                >
                  <Icon className={clsx("w-5 h-5", form.vehicle_type === value ? "text-primary" : "text-ink/40 dark:text-white/40")} />
                  <span className="text-xs font-semibold">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <Button fullWidth size="lg" loading={mutation.isPending} onClick={() => mutation.mutate()} className="!mt-6">
            Enregistrer
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
