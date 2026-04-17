"use client";
import { Skeleton } from "@/components/ui/skeleton";
import CreatePostForm from "@/features/post/components/CreatePostForm";
import { useSinglePostQuery } from "@/features/post/post.queries";
import { useSearchParams } from "next/navigation";

const UpdatePost = () => {
  const searchParams = useSearchParams();
  const postId = searchParams.get("postId");

  const { data: post, isLoading } = useSinglePostQuery(postId!);

  //mi creo i default values
  const defaultValue = {
    location: post?.location ?? "",
    country: post?.country ?? "",
    description: post?.description ?? "",
    img: post?.img ?? "",
  };

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-primary text-center h2">Update Post</h1>

      {isLoading && (
        <div className="flex flex-col gap-8 bg-input rounded-sm p-5 w-sm md:w-md lg:w-lg mx-auto">
          {Array.from({ length: 4 }).map((_, pos) => (
            <Skeleton key={pos} className="w-full h-12" />
          ))}
        </div>
      )}
      {!isLoading && post !== undefined && (
        <CreatePostForm defaultValue={defaultValue} postId={post!.id} />
      )}
    </section>
  );
};

export default UpdatePost;
