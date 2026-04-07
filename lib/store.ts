import { create } from "zustand";
import { DEFAULT_PARAMS } from "@/app/(home)/page";
import { PostParams } from "@/features/post/post.service";

export type FilterStore = {
  filters: PostParams;
  setFilters: (newFilters: Partial<PostParams>) => void;
};

//Creo lo Store
export const useFilterStore = create<FilterStore>((set) => ({
  // 1. Lo stato iniziale
  filters: DEFAULT_PARAMS,

  // 2. L'azione per aggiornare i filtri
  // 'newFilters' sarà l'oggetto con i nuovi valori che passerai quando chiami la funzione
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
}));
