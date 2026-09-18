"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, MessageCircle, UserPlus, CheckCircle2, Radar } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import clsx from "clsx";
import { useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "@/lib/hooks";
import { api } from "@/lib/api";
import { Notification } from "@/lib/types";
import { EmptyState } from "../ui/EmptyState";
import { motion, AnimatePresence, popIn } from "../motion/primitives";

const ICONS: Record<string, typeof Bell> = {
  new_request: Radar,
  new_response: UserPlus,
  ride_confirmed: CheckCircle2,
  new_message: MessageCircle,
};

export function NotificationBell() {
  const { data: notifications = [] } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const qc = useQueryClient();
  const router = useRouter();
  const unread = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function handleClickNotif(n: Notification) {
    if (!n.is_read) {
      await api.post(`/notifications/${n.id}/read`);
      qc.invalidateQueries({ queryKey: ["notifications"] });
    }
    setOpen(false);
    if (n.type === "new_request" && n.related_id) router.push(`/requests/${n.related_id}`);
    else if (n.type === "new_response" && n.related_id) router.push(`/responses/${n.related_id}`);
    else if (n.type === "ride_confirmed" && n.related_id) router.push(`/responses/${n.related_id}`);
    else if (n.type === "new_message" && n.related_id) router.push(`/chat/${n.related_id}`);
  }

  async function markAllRead() {
    await api.post("/notifications/read-all");
    qc.invalidateQueries({ queryKey: ["notifications"] });
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-ink/5 dark:hover:bg-white/5 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
      {open && (
        <motion.div
          initial="hidden"
          animate="show"
          exit="exit"
          variants={popIn}
          style={{ transformOrigin: "top right" }}
          className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-card rounded-2xl shadow-popover border border-ink/8 dark:border-white/8 overflow-hidden z-50"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-ink/6 dark:border-white/6">
            <h3 className="font-bold text-sm">Notifications</h3>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs text-primary font-semibold hover:underline">
                Tout marquer comme lu
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto scrollbar-none">
            {notifications.length === 0 ? (
              <EmptyState icon={Bell} title="Aucune notification" description="Tu seras averti ici des nouvelles réponses et messages." />
            ) : (
              notifications.map((n) => {
                const Icon = ICONS[n.type] || Bell;
                return (
                  <button
                    key={n.id}
                    onClick={() => handleClickNotif(n)}
                    className={clsx(
                      "w-full flex gap-3 px-4 py-3 text-left hover:bg-ink/3 dark:hover:bg-white/5 transition-colors border-b border-ink/4 dark:border-white/4 last:border-0",
                      !n.is_read && "bg-primary/5"
                    )}
                  >
                    <div className={clsx("w-9 h-9 rounded-full flex items-center justify-center shrink-0", !n.is_read ? "bg-primary text-white" : "bg-ink/8 dark:bg-white/8 text-ink/50 dark:text-white/50")}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{n.title}</p>
                      <p className="text-xs text-ink/50 dark:text-white/50 truncate">{n.body}</p>
                      <p className="text-[11px] text-ink/35 dark:text-white/35 mt-0.5">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: fr })}
                      </p>
                    </div>
                    {!n.is_read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5 ml-auto" />}
                  </button>
                );
              })
            )}
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
