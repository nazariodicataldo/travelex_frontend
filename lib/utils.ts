import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SessionExpiredError } from "./backend";
import { PostParams } from "@/features/post/post.service";
import { useFilterStore } from "./store";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof SessionExpiredError
    ? error.message
    : error instanceof Error
      ? error.message
      : fallbackMessage;
}

export function pushFilters(newFilters: Partial<PostParams>) {
  // 1. Accedi allo stato dello store (Zustand)
  const { filters, setFilters } = useFilterStore.getState();

  // 2. Calcola i nuovi filtri e aggiorna lo store
  const updated = { ...filters, ...newFilters };
  setFilters(updated);

  // 3. Costruisci i parametri URL
  const params = new URLSearchParams();
  Object.entries(updated).forEach(([key, val]) => {
    console.log(val);
    // Logica di pulizia URL
    if (val === undefined || val === null || val === "") return;
    if (key === "orderBy" && val === "id") return;
    if (key === "order" && val === "asc") return;
    if (key === "page" && val === 1) return;
    if (key === "perPage" && val === 12) return;

    params.set(key, String(val));
  });

  // 4. Aggiorna l'URL senza ricaricare la pagina
  const queryString = params.toString();
  const newRelativePathQuery =
    window.location.pathname + (queryString ? `?${queryString}` : "");

  // Usa history.pushState per cambiare l'URL "silenziosamente"
  window.history.pushState(null, "", newRelativePathQuery);
}
