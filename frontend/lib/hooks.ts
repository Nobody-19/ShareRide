import { useQuery } from "@tanstack/react-query";
import { api } from "./api";
import { Notification } from "./types";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await api.get<Notification[]>("/notifications");
      return data;
    },
    refetchInterval: 12_000,
  });
}
