"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth-context";
import { apiErrorMessage } from "@/lib/api";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Bienvenue sur ShareRide !");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Email ou mot de passe incorrect"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Content de te revoir" subtitle="Connecte-toi pour rejoindre ton prochain trajet.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="toi@universite.tg"
          icon={<Mail className="w-4 h-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div>
          <Input
            label="Mot de passe"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            icon={<Lock className="w-4 h-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="relative float-right -mt-9 mr-3.5 text-ink/40 dark:text-white/40"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <Button type="submit" fullWidth size="lg" loading={loading} className="!mt-6">
          Se connecter
        </Button>
      </form>

      <div className="mt-5 p-3.5 rounded-xl bg-primary/5 border border-primary/10 text-xs text-ink/60 dark:text-white/60">
        <p className="font-semibold text-primary mb-1">Compte de démo</p>
        ahmed@ipnet.tg / password123
      </div>

      <p className="text-center text-sm text-ink/50 dark:text-white/50 mt-6">
        Pas encore de compte ?{" "}
        <Link href="/auth/signup" className="text-primary font-semibold hover:underline">
          Créer un compte
        </Link>
      </p>
    </AuthShell>
  );
}
