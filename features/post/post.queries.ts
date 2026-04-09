import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PostService } from "./post.service";
import { useFilterStore } from "@/lib/store";
import { LikeService } from "../like/like.service";
import { Post } from "../post/post.type";

export function usePostsQuery(token?: string) {
  // Recuperi solo i filtri
  const filters = useFilterStore((state) => state.filters);

  return useQuery({
    queryKey: ["posts", JSON.stringify(filters)], // <-- stringa, confronto per valore
    queryFn: () => PostService.index(filters, token),
  });
}

export function useLikeMutation() {
  const queryClient = useQueryClient();

  //Recupero i filtri per la queryKey
  const filters = useFilterStore((state) => state.filters);

  const filtersStringified = JSON.stringify(filters);

  return useMutation({
    mutationFn: ({ postId, token }: { postId: string; token: string }) =>
      LikeService.toggle({ postId, token }),
    onMutate: async ({ postId }) => {
      // 1. Blocca eventuali refetch in corso sulla query "posts"
      //    perché potrebbero sovrascrivere il nostro update ottimistico
      await queryClient.cancelQueries({
        queryKey: ["posts", filtersStringified],
      });

      // 2. Salva snapshot dei dati attuali — serve per il rollback
      const previous = queryClient.getQueryData(["posts", filtersStringified]);

      // 3. Modifica la cache direttamente, senza aspettare il server
      queryClient.setQueryData(["posts", filtersStringified], (old: Post[]) =>
        old.map((p) => {
          if (p.id !== postId) return p; // gli altri post non cambiano

          // Inverte lo stato del like e aggiusta il contatore
          return {
            ...p,
            likedByMe: !p.likedByMe,
            likes: p.likedByMe
              ? p.likes - 1 // stava a true, ora toglie
              : p.likes + 1, // stava a false, ora aggiunge
          };
        }),
      );

      // 4. Ritorna lo snapshot — React Query lo passa a onError come context
      return { previous };
    },
    onError: (_err, _postId, context) => {
      // La chiamata è fallita — ripristina i dati precedenti
      queryClient.setQueryData(
        ["posts", filtersStringified],
        context?.previous,
      );
    },
    onSettled: () => {
      // Dopo success o error, risincronizza con il server
      // così likes è quello reale e non quello stimato
      queryClient.invalidateQueries({
        queryKey: ["posts", filtersStringified],
      });
    },
  });
}
