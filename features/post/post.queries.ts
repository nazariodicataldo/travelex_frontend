import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PostService } from "./post.service";
import { useFilterStore } from "@/lib/store";
import { LikeService } from "../like/like.service";
import { Post } from "../post/post.type";
import { toast } from "sonner";

export function usePostsQuery(token?: string) {
  // Recuperi solo i filtri
  const filters = useFilterStore((state) => state.filters);

  return useQuery({
    queryKey: ["posts", JSON.stringify(filters)], // <-- stringa, confronto per valore
    queryFn: () => PostService.index(filters, token),
  });
}

export function useSinglePostQuery(id: string, token?: string) {
  return useQuery({
    queryKey: ["posts", { id }],
    queryFn: () => PostService.show(id, token),
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
      const postsKey = ["posts", filtersStringified];
      const singlePostKey = ["posts", { id: postId }];

      // 1. Cancella refetch in corso per entrambi
      await queryClient.cancelQueries({ queryKey: postsKey });
      await queryClient.cancelQueries({ queryKey: singlePostKey });

      // 2. Snapshot di entrambi per rollback
      const previousPosts = queryClient.getQueryData<Post[]>(postsKey);
      const previousSingle = queryClient.getQueryData<Post>(singlePostKey);

      // 3. Update Ottimistico Lista
      queryClient.setQueryData<Post[]>(postsKey, (old) =>
        old?.map((p) =>
          p.id === postId
            ? {
                ...p,
                likedByMe: !p.likedByMe,
                likes: p.likedByMe ? p.likes - 1 : p.likes + 1,
              }
            : p,
        ),
      );

      // 4. Update Ottimistico Singolo Post
      queryClient.setQueryData<Post>(singlePostKey, (old) =>
        old
          ? {
              ...old,
              likedByMe: !old.likedByMe,
              likes: old.likedByMe ? old.likes - 1 : old.likes + 1,
            }
          : old,
      );

      // 4. Ritorna lo snapshot — React Query lo passa a onError come context
      return { previousPosts, previousSingle, postId };
    },
    onError: (err, _postId, context) => {
      toast.error(err.message, { position: "bottom-right" });
      // La chiamata è fallita — ripristina i dati precedenti
      if (context?.previousPosts)
        queryClient.setQueryData(
          ["posts", filtersStringified],
          context.previousPosts,
        );
      if (context?.previousSingle)
        queryClient.setQueryData(
          ["posts", { id: context.postId }],
          context.previousSingle,
        );
    },
    onSettled: (_data, _error, { postId }) => {
      // Invalida entrambi in parallelo
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["posts", filtersStringified],
        }),
        queryClient.invalidateQueries({ queryKey: ["posts", { id: postId }] }),
      ]);
    },
  });
}
