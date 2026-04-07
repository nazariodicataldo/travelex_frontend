import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import PostsGrid from "@/features/post/components/PostsGrid";
import { PostParams, PostService } from "@/features/post/post.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Compass } from "lucide-react";

export const DEFAULT_PARAMS: PostParams = {
  order: "asc",
  orderBy: "created_at",
  perPage: 12,
  page: 1,
};

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["posts", DEFAULT_PARAMS],
    queryFn: () => PostService.index(DEFAULT_PARAMS),
  });

  return (
    <>
      {/* Hero */}
      <section className="flex flex-col items-center gap-4">
        <h1 className="h1 text-primary">Breathe.</h1>
        <p className="text-muted-foreground text-lg font-medium">
          Curated narratives from the world&apos;s most evocative corners.
        </p>
        <InputGroup className="w-full md:max-w-sm lg:max-w-lg py-6 ">
          <InputGroupInput
            placeholder="Where does your soul need to go?"
            className="h-8"
          />
          <InputGroupAddon>
            <Compass className="size-5 text-primary" />
          </InputGroupAddon>
        </InputGroup>
      </section>

      {/* Griglia Post */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="mt-8 flex flex-col gap-8">
          <h2 className="text-primary">Latest posts</h2>
          <PostsGrid />
        </div>
      </HydrationBoundary>
    </>
  );
}
