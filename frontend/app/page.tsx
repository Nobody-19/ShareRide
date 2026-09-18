"use client";

import Link from "next/link";
import { ArrowRight, Check, MapPin, Star, GraduationCap } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { LogoBadge } from "@/components/ui/Logo";
import { motion } from "@/components/motion/primitives";
import { fadeUp, StaggerGroup, StaggerItem } from "@/components/motion/primitives";

const STEPS = [
  {
    n: "01",
    title: "Poste ta requête",
    text: "Départ, destination, horaire. Vingt secondes, pas plus.",
  },
  {
    n: "02",
    title: "Reçois des réponses",
    text: "Les étudiants vérifiés sur ton trajet te voient et se proposent.",
  },
  {
    n: "03",
    title: "Choisis et pars",
    text: "Compare les profils, confirme, coordonne-toi par chat.",
  },
];

const CHECKS = [
  "Carte étudiante ou carte nationale, vérifiée avant le premier trajet",
  "Note et avis visibles sur chaque profil",
  "Position partagée uniquement le jour du trajet",
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-bg">
      <header className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 font-extrabold text-lg text-ink">
          <LogoBadge className="w-8 h-8 rounded-lg" />
          ShareRide
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard">
              <Button size="sm">Mon dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm font-medium text-ink/60 hidden sm:block hover:text-ink transition-colors">
                Se connecter
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Créer un compte</Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-8 pb-24 grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <p className="text-xs font-bold tracking-[0.14em] text-primary uppercase mb-4">Covoiturage étudiant · Togo</p>
          <h1 className="text-[2.6rem] sm:text-5xl font-extrabold leading-[1.08] tracking-tight text-balance text-ink">
            Trouve un trajet vers ton campus, pas un inconnu au hasard.
          </h1>
          <p className="text-ink/55 text-lg max-w-md mt-5 leading-relaxed">
            Poste ta requête, et les étudiants vérifiés qui vont dans ta direction te répondent
            directement. Tu choisis avec qui partir.
          </p>
          <div className="flex items-center gap-3 mt-8">
            <Link href="/auth/signup">
              <Button size="lg">
                Commencer <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                Se connecter
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-3 mt-9">
            <div className="flex -space-x-2.5">
              <Avatar name="Ahmed Diallo" size="sm" className="ring-2 ring-bg" />
              <Avatar name="Amara Kokou" size="sm" className="ring-2 ring-bg" />
              <Avatar name="Kofi Mensah" size="sm" className="ring-2 ring-bg" />
            </div>
            <p className="text-sm text-ink/50">
              Déjà utilisé par des étudiants d&apos;<span className="text-ink font-medium">IPNET</span>,{" "}
              <span className="text-ink font-medium">UL</span> et{" "}
              <span className="text-ink font-medium">Polytechnique</span>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: [0.2, 0, 0, 1], delay: 0.05 }}
          className="relative hidden sm:block"
        >
          <div className="absolute inset-0 -z-10 bg-primary/[0.04] rounded-[2rem] scale-95 blur-2xl" />

          <div className="bg-card border border-ink/8 rounded-2xl shadow-card p-5 rotate-[-1.5deg]">
            <div className="flex items-center gap-3 mb-4">
              <Avatar name="Ahmed Diallo" size="md" />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-ink">Ahmed Diallo</p>
                <div className="flex items-center gap-1 text-xs text-ink/50">
                  <Star className="w-3 h-3 fill-secondary text-secondary" />
                  4.9 · Vérifié
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-ink mb-2">
              <span>Cité OUA</span>
              <span className="flex-1 h-px bg-ink/12 relative">
                <MapPin className="w-3.5 h-3.5 text-secondary absolute -top-1.5 right-0" />
              </span>
              <span>Université de Lomé</span>
            </div>
            <p className="text-xs text-ink/45">Demain · 07h00 · 2 places</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.35 }}
            className="absolute -bottom-14 -left-6 bg-card border border-ink/8 rounded-xl shadow-popover p-3.5 flex items-center gap-3 rotate-[2deg] w-64"
          >
            <div className="w-9 h-9 rounded-full bg-success-100 text-success-700 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-ink">Amara a répondu</p>
              <p className="text-[11px] text-ink/45 truncate">&ldquo;Je pars à la même heure !&rdquo;</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Process */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <StaggerGroup className="grid sm:grid-cols-3 gap-0 border-t border-ink/8">
          {STEPS.map((step) => (
            <StaggerItem key={step.n} className="py-8 sm:pr-8 sm:border-r sm:last:border-r-0 border-ink/8">
              <span className="text-sm font-bold text-primary/50 tabular-nums">{step.n}</span>
              <h3 className="font-bold text-lg mt-2 text-ink">{step.title}</h3>
              <p className="text-sm text-ink/50 mt-1.5 leading-relaxed">{step.text}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* Trust */}
      <section className="max-w-6xl mx-auto px-6 pb-28 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Des profils vérifiés, pas des inconnus.
          </h2>
          <p className="text-ink/55 mt-3 max-w-md leading-relaxed">
            Avant de covoiturer, chaque étudiant confirme son identité avec sa carte étudiante
            ou sa carte nationale.
          </p>
          <ul className="mt-6 space-y-3">
            {CHECKS.map((c) => (
              <li key={c} className="flex items-start gap-2.5 text-sm text-ink/70">
                <Check className="w-4 h-4 text-success-600 mt-0.5 shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-card border border-ink/8 rounded-2xl shadow-soft p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-ink">Vérification d&apos;identité</span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-success-700 bg-success-100 px-2.5 py-1 rounded-full">
              <Check className="w-3 h-3" />
              Vérifié
            </span>
          </div>
          <div className="flex items-center gap-3 bg-surface rounded-xl p-3.5 border border-ink/6">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Carte Étudiant</p>
              <p className="text-xs text-ink/40">#TG40093695</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="aspect-[16/10] rounded-xl bg-primary-100" />
            <div className="aspect-[16/10] rounded-xl bg-secondary-100" />
          </div>
        </div>
      </section>

      <footer className="border-t border-ink/8">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between text-sm text-ink/40">
          <span>ShareRide — Lomé, Togo</span>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
}
