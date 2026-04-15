import { useQuery } from "@tanstack/react-query";
import { UserService } from "./user.service";

export function useUserQuery(userId?: string, token?: string) {
  return useQuery({
    queryKey: ["users", { id: userId }],
    queryFn: () => UserService.show(userId!, token!),
    // La query parte solo se entrambi i valori sono definiti
    enabled: !!userId && !!token,
    staleTime: 1000 * 60 * 5, // 5 minuti
  });
}
