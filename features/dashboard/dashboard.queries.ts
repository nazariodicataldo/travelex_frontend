import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "./dashboard.service";

export function useDashboardQuery(token?: string) {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => DashboardService.index(token!),
    enabled: !!token,
  });
}
