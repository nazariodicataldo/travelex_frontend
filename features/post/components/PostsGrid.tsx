"use client";
import { Skeleton } from "@/components/ui/skeleton";
import PostCard from "./PostCard";
import { usePostsQuery } from "../post.queries";
import { useAuthUserStore } from "@/features/auth/auth.store";
import OrderBySelect from "@/components/ui/OrderBySelect";

const PostsGrid = () => {
  const token = useAuthUserStore((state) => state.token);

  const { data: posts = [], isLoading } = usePostsQuery(token);

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
      <div className="flex gap-4 flex-col">
        <div className="flex justify-between items-center">
          <small>
            <span className="font-bold">{posts.length}</span> posts found
          </small>
          <OrderBySelect />
        </div>
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
