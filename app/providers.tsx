"use client"; // Necessario per usare il context

import { handleLogout } from "@/features/auth/auth.actions";
import { useAuthUserStore } from "@/features/auth/auth.store";
import { SessionExpiredError } from "@/lib/backend";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import router from "next/router";
import { useState } from "react";
import { toast } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  const logout = useAuthUserStore((state) => state.logout);

  // Inizializziamo il QueryClient all'interno dello stato per evitare
  // che venga condiviso tra diverse richieste/utenti
  const [queryClient] = useState(
    () =>
      new QueryClient({
        mutationCache: new MutationCache({
          onError: (error) => {
            if (error instanceof SessionExpiredError) {
              handleSessionExpired(logout);
            }
          },
        }),
        queryCache: new QueryCache({
          onError: (error) => {
            if (error instanceof SessionExpiredError) {
              handleSessionExpired(logout);
            }
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            // I dati sono considerati "freschi" per 1 minuto
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

function handleSessionExpired(clear: () => void) {
  clear(); // svuota Zustand
  handleLogout(); // cancella il cookie server-side
  toast.error("Sessione scaduta, effettua nuovamente il login");
  router.push("/login");
}
