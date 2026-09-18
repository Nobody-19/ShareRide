"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Search, PlusCircle, User, Settings } from "lucide-react";
import clsx from "clsx";

const NAV = [
  { href: "/dashboard", label: "Accueil", icon: LayoutGrid },
  { href: "/requests", label: "Trajets", icon: Search },
  { href: "/requests/new", label: "Poster", icon: PlusCircle, primary: true },
  { href: "/profile", label: "Profil", icon: User },
  { href: "/settings", label: "Réglages", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-ink/8 dark:border-white/8 flex items-stretch z-40"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {NAV.map(({ href, label, icon: Icon, primary }) => {
        const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
        if (primary) {
          return (
            <Link key={href} href={href} className="flex-1 flex flex-col items-center justify-center py-2 relative">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 -mt-5 border-4 border-surface dark:border-[#0d0e17]">
                <Icon className="w-6 h-6" />
              </div>
            </Link>
          );
        }
        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
              active ? "text-primary" : "text-ink/40 dark:text-white/40"
            )}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
