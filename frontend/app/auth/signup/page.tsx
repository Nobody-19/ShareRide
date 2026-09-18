"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Phone, Calendar, GraduationCap, IdCard, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import { useAuth } from "@/lib/auth-context";
import { api, apiErrorMessage } from "@/lib/api";

const UNIVERSITIES = ["Université de Lomé", "IPNET", "Polytechnique", "ESTBA", "ESA", "Autre"];
const STEPS = ["Compte", "Photo", "Documents", "Terminé"];

export default function SignupPage() {
  const { signup, setUser } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    operator: "OrangeCI",
    birth_date: "",
    university: "Université de Lomé",
  });

  const [photoUrl, setPhotoUrl] = useState("");
  const [docType, setDocType] = useState<"carte_etudiant" | "carte_nationale">("carte_etudiant");
  const [docFront, setDocFront] = useState("");
  const [docBack, setDocBack] = useState("");

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(form);
      setStep(1);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Impossible de créer le compte"));
    } finally {
      setLoading(false);
    }
  }

  async function handleStep2() {
    setLoading(true);
    try {
      if (photoUrl) {
        const { data } = await api.put("/users/me", { profile_photo_url: photoUrl });
        setUser(data);
      }
      setStep(2);
    } finally {
      setLoading(false);
    }
  }

  async function handleStep3() {
    if (!docFront) {
      toast.error("Ajoute au moins le recto de ton document");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-documents", {
        document_type: docType,
        document_front_url: docFront,
        document_back_url: docBack || null,
      });
      setUser(data);
      setStep(3);
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Crée ton compte" subtitle="Rejoins la communauté étudiante ShareRide.">
      <div className="flex items-center gap-2 mb-7">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={clsx("h-1.5 rounded-full transition-colors", i <= step ? "bg-primary" : "bg-ink/10 dark:bg-white/10")} />
          </div>
        ))}
      </div>

      {step === 0 && (
        <form onSubmit={handleStep1} className="space-y-4 animate-fade-in">
          <Input
            label="Nom complet"
            icon={<User className="w-4 h-4" />}
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            placeholder="Kossi Agbeko"
            required
          />
          <Input
            label="Email"
            type="email"
            icon={<Mail className="w-4 h-4" />}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="toi@universite.tg"
            required
          />
          <Input
            label="Mot de passe"
            type="password"
            icon={<Lock className="w-4 h-4" />}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="8 caractères minimum"
            minLength={6}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Téléphone"
              icon={<Phone className="w-4 h-4" />}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+228 90 00 00 00"
              required
            />
            <Select
              label="Opérateur"
              value={form.operator}
              onChange={(e) => setForm({ ...form, operator: e.target.value })}
            >
              <option>OrangeCI</option>
              <option>Moov</option>
              <option>Togocom</option>
              <option>Autre</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date de naissance"
              type="date"
              icon={<Calendar className="w-4 h-4" />}
              value={form.birth_date}
              onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
              required
            />
            <Select
              label="Université"
              value={form.university}
              onChange={(e) => setForm({ ...form, university: e.target.value })}
            >
              {UNIVERSITIES.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </Select>
          </div>

          <Button type="submit" fullWidth size="lg" loading={loading} className="!mt-6">
            Continuer
          </Button>

          <p className="text-center text-sm text-ink/50 dark:text-white/50 mt-4">
            Déjà inscrit ?{" "}
            <Link href="/auth/login" className="text-primary font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </form>
      )}

      {step === 1 && (
        <div className="space-y-5 animate-fade-in">
          <FileUpload label="Photo de profil (selfie)" rounded value={photoUrl} onChange={setPhotoUrl} hint="Ajoute un selfie clair" />
          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={() => setStep(0)}>
              Retour
            </Button>
            <Button fullWidth loading={loading} onClick={handleStep2}>
              {photoUrl ? "Continuer" : "Passer cette étape"}
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5 animate-fade-in">
          <div>
            <p className="block text-sm font-medium mb-2">Type de document</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDocType("carte_etudiant")}
                className={clsx(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors",
                  docType === "carte_etudiant" ? "border-primary bg-primary/5" : "border-ink/10 dark:border-white/10"
                )}
              >
                <GraduationCap className={clsx("w-6 h-6", docType === "carte_etudiant" ? "text-primary" : "text-ink/40 dark:text-white/40")} />
                <span className="text-sm font-semibold">Carte Étudiant</span>
              </button>
              <button
                type="button"
                onClick={() => setDocType("carte_nationale")}
                className={clsx(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors",
                  docType === "carte_nationale" ? "border-primary bg-primary/5" : "border-ink/10 dark:border-white/10"
                )}
              >
                <IdCard className={clsx("w-6 h-6", docType === "carte_nationale" ? "text-primary" : "text-ink/40 dark:text-white/40")} />
                <span className="text-sm font-semibold">Carte Nationale</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FileUpload label="Recto" value={docFront} onChange={setDocFront} hint="Photo du recto" />
            <FileUpload label="Verso" value={docBack} onChange={setDocBack} hint="Photo du verso" />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={() => setStep(1)}>
              Retour
            </Button>
            <Button fullWidth loading={loading} onClick={handleStep3}>
              Soumettre pour vérification
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col items-center text-center py-6 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-5">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h3 className="font-extrabold text-xl mb-2">Compte créé avec succès !</h3>
          <p className="text-sm text-ink/50 dark:text-white/50 mb-6 max-w-xs">
            Tes documents sont <span className="font-semibold text-secondary">en attente de vérification</span>. Tu peux déjà explorer
            ShareRide pendant ce temps.
          </p>
          <Button fullWidth size="lg" onClick={() => router.push("/dashboard")}>
            Aller au dashboard
          </Button>
        </div>
      )}
    </AuthShell>
  );
}
