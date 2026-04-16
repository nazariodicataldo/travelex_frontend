"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useAuthUserStore } from "@/features/auth/auth.store";
import { Like } from "@/features/like/like.type";
import PostCard from "@/features/post/components/PostCard";
import { Post } from "@/features/post/post.type";
import { useUserQuery } from "@/features/user/user.queries";
import { PackageOpen, PlusIcon } from "lucide-react";
import Link from "next/link";

function FavoritePosts({ likes }: { likes: Like[] }) {
  return (
    <Carousel>
      <CarouselContent>
        {likes.map((like) => (
          <CarouselItem
            key={like.post!.id}
            className="md:basis-1/2 lg:basis-1/3"
          >
            <PostCard post={like.post!} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

function PostsCarousel({ posts }: { posts: Post[] }) {
  return (
    <Carousel>
      <CarouselContent>
        {posts.map((post) => (
          <CarouselItem key={post.id} className="md:basis-1/2 lg:basis-1/3">
            <PostCard post={post} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

function EmptyPosts() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageOpen className="text-primary size-6" />
        </EmptyMedia>
        <EmptyTitle>No Posts Loaded</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t loaded any posts yet. Get started by creating your
          first posts.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button nativeButton={false} render={<Link href={"/create-post"} />}>
          <PlusIcon />
          Create Post
        </Button>
      </EmptyContent>
    </Empty>
  );
}

const Me = () => {
  const { user, token } = useAuthUserStore();

  const { data: userDb } = useUserQuery(user?.id, token);

  if (!userDb) {
    return <p>Loading your profile</p>;
  }

  return (
    <section className="flex flex-col gap-8">
      {/* Main info */}
      <Card>
        <CardContent>
          <div className="flex gap-4 text-primary items-center">
            <Avatar className={"size-18"}>
              <AvatarImage
                src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${userDb.username}`}
              />
            </Avatar>
            <div className="flex flex-col gap-1">
              <h1 className="h5">{userDb.username}</h1>
              {/* Solo io posso vedere la mia email */}
              {user?.id === userDb.id && <p>{userDb.email}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loaded posts */}
      <Card className="bg-secondary/20">
        <CardHeader>
          <CardTitle>
            <h2 className="text-primary h4">Your Posts</h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-8 px-16">
          {userDb.posts.length ? (
            <PostsCarousel posts={userDb.posts} />
          ) : (
            <EmptyPosts />
          )}
        </CardContent>
      </Card>

      {/* Posts you liked */}
      <Card className="bg-secondary/20">
        <CardHeader>
          <CardTitle>
            <h2 className="text-primary h4">Post you liked</h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-8 px-16">
          {userDb.likes.length ? (
            <FavoritePosts likes={userDb.likes} />
          ) : (
            <div className="min-h-52 flex justify-center items-center">
              <span className="text-muted-foreground italic">
                Noting to show
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default Me;
