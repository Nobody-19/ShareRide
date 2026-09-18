"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { LogoBadge } from "@/components/ui/Logo";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/auth/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-surface dark:bg-[#0d0e17]">
        <LogoBadge tone="tint" className="w-12 h-12 rounded-2xl animate-pulse" />
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface dark:bg-[#0d0e17]">
      <Sidebar />
      <div className="flex-1 min-w-0 pb-20 lg:pb-0">{children}</div>
      <BottomNav />
    </div>
  );
}
