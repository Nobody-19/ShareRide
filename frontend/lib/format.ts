import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export function formatRequestDate(dateStr: string) {
  const d = parseISO(dateStr);
  if (isToday(d)) return "Aujourd'hui";
  if (isTomorrow(d)) return "Demain";
  return format(d, "EEEE d MMMM", { locale: fr });
}

export function formatTime(timeStr: string) {
  return timeStr;
}
