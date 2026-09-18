"use client";

import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import { LogoBadge } from "@/components/ui/Logo";
import { NotificationBell } from "./NotificationBell";

export function Topbar({ title }: { title?: string }) {
  const { isDark, toggleDark } = useTheme();

  return (
    <header className="sticky top-0 z-30 bg-surface/80 dark:bg-[#0d0e17]/80 backdrop-blur-md border-b border-ink/6 dark:border-white/6 px-4 sm:px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Link href="/dashboard" className="lg:hidden flex items-center gap-1.5 font-extrabold text-primary mr-2">
          <LogoBadge tone="tint" className="w-7 h-7 rounded-lg" />
        </Link>
        {title && <h1 className="font-extrabold text-lg sm:text-xl">{title}</h1>}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={toggleDark}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-ink/5 dark:hover:bg-white/5 transition-colors"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <NotificationBell />
      </div>
    </header>
  );
}
