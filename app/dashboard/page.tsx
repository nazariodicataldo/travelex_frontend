import { getAuthToken } from "@/features/auth/auth.actions";
import DashboardWrapper from "@/features/dashboard/components/DashboardWrapper";
import { DashboardService } from "@/features/dashboard/dashboard.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const DashboardPage = async () => {
  const token = await getAuthToken();

  //Prefetch della query
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["dashboard"],
    queryFn: () => DashboardService.index(token!),
  });

  return (
    <section>
      <h1 className="text-primary">Dashboard</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DashboardWrapper />
      </HydrationBoundary>
    </section>
  );
};

export default DashboardPage;
