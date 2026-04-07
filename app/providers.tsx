"use client"; // Necessario per usare il context

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Inizializziamo il QueryClient all'interno dello stato per evitare
  // che venga condiviso tra diverse richieste/utenti
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // I dati sono considerati "freschi" per 1 minuto
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
