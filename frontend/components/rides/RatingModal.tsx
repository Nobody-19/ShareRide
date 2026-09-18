"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { api, apiErrorMessage } from "@/lib/api";
import { Button } from "../ui/Button";
import { TextArea } from "../ui/Input";
import { StarInput } from "../ui/StarRating";
import { Avatar } from "../ui/Avatar";
import { motion, overlayFade, sheetUp } from "../motion/primitives";

export function RatingModal({
  rideId,
  otherUserName,
  otherUserPhoto,
  onClose,
}: {
  rideId: string;
  otherUserName: string;
  otherUserPhoto?: string | null;
  onClose: () => void;
}) {
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => (await api.post(`/rides/${rideId}/rate`, { stars, comment })).data,
    onSuccess: () => {
      toast.success("Merci pour ton évaluation !");
      qc.invalidateQueries({ queryKey: ["rides"] });
      onClose();
    },
    onError: (err) => toast.error(apiErrorMessage(err, "Impossible d'enregistrer la note")),
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
        className="bg-card w-full sm:max-w-sm sm:rounded-2xl rounded-t-3xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end -mt-2 -mr-2 mb-1">
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-ink/5 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-col items-center text-center">
          <Avatar src={otherUserPhoto} name={otherUserName} size="lg" />
          <h3 className="font-extrabold text-lg mt-3 text-ink">Comment s&apos;est passé le trajet ?</h3>
          <p className="text-sm text-ink/50 mb-4">Note ton expérience avec {otherUserName}</p>
          <StarInput value={stars} onChange={setStars} />
          <TextArea
            className="mt-5"
            placeholder="Un mot sur le trajet (optionnel)"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button fullWidth size="lg" className="mt-4" loading={mutation.isPending} onClick={() => mutation.mutate()}>
            Envoyer la note
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
