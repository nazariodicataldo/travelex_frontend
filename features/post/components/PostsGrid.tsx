"use client";
import { useQuery } from "@tanstack/react-query";
import { PostService } from "../post.service";
import { useFilterStore } from "@/lib/store";
import { Skeleton } from "@/components/ui/skeleton";
import PostCard from "./PostCard";

const PostsGrid = () => {
  // Recuperi solo i filtri
  const filters = useFilterStore((state) => state.filters);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts", filters],
    queryFn: () => PostService.index(filters),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, pos) => (
          <Skeleton key={pos} className="w-full aspect-square" />
        ))}
      </div>
    );
  }

  if ((!isLoading && !posts) || posts.length === 0) {
    return (
      <p className="italic text-lg text-center text-muted-foreground ">
        No posts found
      </p>
    );
  }

  if (!isLoading && posts && posts.length > 0) {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {posts.map((post) => (
            <PostCard post={post} key={post.id} />
          ))}
        </div>
      </div>
    );
  }
};

export default PostsGrid;
