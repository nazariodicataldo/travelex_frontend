import { create } from "zustand";
import { DEFAULT_PARAMS } from "@/app/(home)/page";
import { PostParams } from "@/features/post/post.service";
import { persist } from "zustand/middleware";

export type FilterStore = {
  filters: PostParams;
  setFilters: (newFilters: Partial<PostParams>) => void;
};

//Creo lo Store
export const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      // 1. Lo stato iniziale
      filters: DEFAULT_PARAMS,

      // 2. L'azione per aggiornare i filtri
      // 'newFilters' sarà l'oggetto con i nuovi valori che passerai quando chiami la funzione
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
    }),
    {
      name: "filtersStore",
    },
  ),
);

export type SessionExpiredDialogStore = {
  open: boolean;
  setOpen: (newState: boolean) => void;
};

//Store per la Dialog
export const useSessionExpiredDialogStore = create<SessionExpiredDialogStore>()(
  persist(
    (set) => ({
      open: false,
      setOpen: (newState) => set(() => ({ open: newState })),
    }),
    {
      name: "sessionExpiredStore",
    },
  ),
);
