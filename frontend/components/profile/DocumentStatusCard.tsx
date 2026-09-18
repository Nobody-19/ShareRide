"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GraduationCap, IdCard, Hash } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";
import { User } from "@/lib/types";
import { api, apiErrorMessage } from "@/lib/api";
import { VerifiedBadge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { FileUpload } from "../ui/FileUpload";

export function DocumentStatusCard({ user }: { user: User }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(user.verification_status === "unsubmitted");
  const [docType, setDocType] = useState<"carte_etudiant" | "carte_nationale">(user.document_type || "carte_etudiant");
  const [front, setFront] = useState(user.document_front_url || "");
  const [back, setBack] = useState(user.document_back_url || "");

  const mutation = useMutation({
    mutationFn: async () =>
      (
        await api.post("/auth/verify-documents", {
          document_type: docType,
          document_front_url: front,
          document_back_url: back || null,
        })
      ).data,
    onSuccess: (data: User) => {
      qc.setQueryData(["me"], data);
      toast.success("Documents envoyés, vérification en cours");
      setEditing(false);
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  return (
    <div className="bg-card rounded-2xl p-5 shadow-soft border border-ink/6 dark:border-white/6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">Vérification d&apos;identité</h3>
        <VerifiedBadge status={user.verification_status} />
      </div>

      {!editing ? (
        <>
          {user.document_type && (
            <div className="flex items-center gap-3 bg-surface dark:bg-white/5 rounded-xl p-3.5">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                {user.document_type === "carte_etudiant" ? <GraduationCap className="w-5 h-5" /> : <IdCard className="w-5 h-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{user.document_type === "carte_etudiant" ? "Carte Étudiant" : "Carte Nationale"}</p>
                {user.document_number && (
                  <p className="text-xs text-ink/45 dark:text-white/45 inline-flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    {user.document_number}
                  </p>
                )}
              </div>
            </div>
          )}
          {(user.document_front_url || user.document_back_url) && (
            <div className="grid grid-cols-2 gap-3">
              {user.document_front_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.document_front_url} alt="Recto" className="rounded-xl aspect-[16/10] object-cover w-full" />
              )}
              {user.document_back_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.document_back_url} alt="Verso" className="rounded-xl aspect-[16/10] object-cover w-full" />
              )}
            </div>
          )}
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            {user.document_type ? "Mettre à jour mes documents" : "Soumettre mes documents"}
          </Button>
        </>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDocType("carte_etudiant")}
              className={clsx(
                "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-colors",
                docType === "carte_etudiant" ? "border-primary bg-primary/5" : "border-ink/10 dark:border-white/10"
              )}
            >
              <GraduationCap className={clsx("w-5 h-5", docType === "carte_etudiant" ? "text-primary" : "text-ink/40 dark:text-white/40")} />
              <span className="text-xs font-semibold">Carte Étudiant</span>
            </button>
            <button
              type="button"
              onClick={() => setDocType("carte_nationale")}
              className={clsx(
                "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-colors",
                docType === "carte_nationale" ? "border-primary bg-primary/5" : "border-ink/10 dark:border-white/10"
              )}
            >
              <IdCard className={clsx("w-5 h-5", docType === "carte_nationale" ? "text-primary" : "text-ink/40 dark:text-white/40")} />
              <span className="text-xs font-semibold">Carte Nationale</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FileUpload label="Recto" value={front} onChange={setFront} />
            <FileUpload label="Verso" value={back} onChange={setBack} />
          </div>
          <div className="flex gap-2">
            {user.document_type && (
              <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                Annuler
              </Button>
            )}
            <Button size="sm" fullWidth loading={mutation.isPending} onClick={() => mutation.mutate()}>
              Envoyer pour vérification
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
