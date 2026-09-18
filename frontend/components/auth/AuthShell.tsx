import Link from "next/link";
import { Check } from "lucide-react";
import { LogoBadge } from "@/components/ui/Logo";

const FEATURES = [
  "Requêtes matchées avec les étudiants de ton trajet",
  "Profils vérifiés par carte étudiante ou nationale",
  "Chat et position partagée le jour du trajet",
];

export function AuthShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="min-h-screen flex bg-bg">
      <div className="hidden lg:flex lg:w-[42%] bg-neutral-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-40 blur-3xl"
          style={{ background: "oklch(var(--primary-600) / 1)" }}
        />

        <Link href="/" className="relative flex items-center gap-2 font-bold text-lg">
          <LogoBadge tone="dark" className="w-8 h-8 rounded-lg" />
          ShareRide
        </Link>

        <div className="relative space-y-7">
          <h1 className="text-3xl font-extrabold leading-[1.15] text-balance tracking-tight">
            Le covoiturage étudiant qui connecte le campus.
          </h1>
          <ul className="space-y-3.5 border-t border-white/10 pt-6">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-white/75">
                <Check className="w-4 h-4 text-white/50 mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/35">© 2026 ShareRide — Fait pour les campus du Togo</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center gap-2 font-bold text-lg mb-8 text-ink">
            <LogoBadge className="w-8 h-8 rounded-lg" />
            ShareRide
          </div>
          <h2 className="text-2xl font-extrabold mb-1 text-ink tracking-tight">{title}</h2>
          <p className="text-ink/50 text-sm mb-7">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
