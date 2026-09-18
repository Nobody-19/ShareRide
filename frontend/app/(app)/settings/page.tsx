"use client";

import { useState } from "react";
import { Moon, Bell, ShieldCheck, LogOut, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Topbar } from "@/components/layout/Topbar";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${checked ? "bg-primary" : "bg-ink/15 dark:bg-white/15"}`}
    >
      <span
        className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`}
      />
    </button>
  );
}

function Row({ icon: Icon, title, subtitle, right }: { icon: typeof Moon; title: string; subtitle?: string; right: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3.5 py-4 px-1">
      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {subtitle && <p className="text-xs text-ink/45 dark:text-white/45">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export default function SettingsPage() {
  const { isDark, toggleDark } = useTheme();
  const { user, logout, setUser } = useAuth();
  const [notifs, setNotifs] = useState(true);

  async function toggle2FA(value: boolean) {
    if (!user) return;
    const { data } = await api.put("/users/me", { two_fa_enabled: value });
    setUser(data);
    toast.success(value ? "2FA activée" : "2FA désactivée");
  }

  return (
    <div>
      <Topbar title="Paramètres" />
      <div className="p-4 sm:p-6 max-w-lg mx-auto space-y-5">
        <div className="bg-card rounded-2xl px-4 shadow-soft border border-ink/6 dark:border-white/6 divide-y divide-ink/6 dark:divide-white/6">
          <Row icon={Moon} title="Mode sombre" subtitle="Change l'apparence de l'application" right={<Toggle checked={isDark} onChange={toggleDark} />} />
          <Row
            icon={Bell}
            title="Notifications"
            subtitle="Recevoir des alertes pour les nouvelles réponses"
            right={<Toggle checked={notifs} onChange={setNotifs} />}
          />
          <Row
            icon={ShieldCheck}
            title="Authentification à 2 facteurs"
            subtitle="Code SMS envoyé à la connexion"
            right={<Toggle checked={!!user?.two_fa_enabled} onChange={toggle2FA} />}
          />
        </div>

        <div className="bg-card rounded-2xl px-4 shadow-soft border border-ink/6 dark:border-white/6">
          <button onClick={logout} className="w-full flex items-center gap-3.5 py-4 px-1 text-red-500">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold flex-1 text-left">Déconnexion</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-center text-xs text-ink/35 dark:text-white/35">ShareRide v1.0 — Fait pour les campus du Togo</p>
      </div>
    </div>
  );
}
