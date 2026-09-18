"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Search, PlusCircle, User, Settings, LogOut } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/lib/auth-context";
import { LogoBadge } from "@/components/ui/Logo";
import { Avatar } from "../ui/Avatar";
import { VerifiedBadge } from "../ui/Badge";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/requests", label: "Trouver un trajet", icon: Search },
  { href: "/requests/new", label: "Poster une requête", icon: PlusCircle },
  { href: "/profile", label: "Mon profil", icon: User },
  { href: "/settings", label: "Paramètres", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 h-screen sticky top-0 border-r border-ink/6 dark:border-white/6 bg-card px-4 py-6 shrink-0">
      <Link href="/dashboard" className="flex items-center gap-2 font-extrabold text-xl text-primary px-2 mb-8">
        <LogoBadge tone="tint" className="w-9 h-9 rounded-xl" />
        ShareRide
      </Link>

      <nav className="flex-1 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                active ? "bg-primary text-white shadow-sm shadow-primary/25" : "text-ink/65 dark:text-white/65 hover:bg-ink/5 dark:hover:bg-white/5"
              )}
            >
              <Icon className="w-[18px] h-[18px]" />
              {label}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="border-t border-ink/6 dark:border-white/6 pt-4 mt-4">
          <Link href="/profile" className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-ink/5 dark:hover:bg-white/5 transition-colors">
            <Avatar src={user.profile_photo_url} name={user.full_name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{user.full_name}</p>
              <VerifiedBadge status={user.verification_status} />
            </div>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/5 transition-colors w-full mt-1"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Déconnexion
          </button>
        </div>
      )}
    </aside>
  );
}
