"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardQuery } from "../dashboard.queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostsCarousel } from "@/app/me/page";
import { User } from "@/features/user/user.type";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Heart, Image, MessageCircle } from "lucide-react";
import { useAuthUserStore } from "@/features/auth/auth.store";

const TopUsers = ({ users }: { users: User[] }) => {
  return (
    <div className="flex flex-col md:flex-row gap-16 ">
      {users.map((user) => (
        <div key={user.id} className="flex flex-col gap-2 items-center">
          <Avatar className={"size-16"}>
            <AvatarImage
              src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${user.username}`}
            />
          </Avatar>
          <p className="text-lg">{user.username}</p>
          <div className="flex flex-col gap-1 items-start text-sm">
            <small className="flex gap-1 items-center">
              <Image size={18} /> <span>Uploaded posts:</span> {user.postsCount}
            </small>
            <small className="flex gap-1 items-center">
              <Heart size={18} /> <span>Likes</span>
              {user.likesCount}
            </small>
            <small className="flex gap-1 items-center">
              <MessageCircle size={18} /> <span>Comments</span>{" "}
              {user.commentsCount}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
};

const DashboardWrapper = () => {
  const { token } = useAuthUserStore();
  const { data, isLoading } = useDashboardQuery(token);

  if (isLoading || !data) {
    return (
      <div className="flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {Array.from({ length: 4 }).map((_, pos) => (
            <Skeleton key={pos} className="aspect-square w-full" />
          ))}
        </div>
        <div className="w-full flex flex-col gap-2">
          <p className="h4 text-primary">Top 5 posts</p>
          <p>Here are top posts, sorted by likes and comments</p>
          <Skeleton className="w-full aspect-video" />
        </div>
        <div className="w-full aspect-video flex flex-col gap-2">
          <p className="h4 text-primary">Top 5 users</p>
          <p>
            Here are top users, sorted by likes and comments and uploaded posts
          </p>
          <Skeleton className="w-full aspect-video" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-12">
      {/* Conteggio di utenti, post, commenti e likes */}
      <Card>
        <CardHeader>
          <CardTitle>
            <h2 className="h4 text-primary">Total counts</h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(data.stats).map(([key, value], pos) => (
            <Card key={pos} className="w-full bg-muted">
              <CardHeader>
                <CardTitle>
                  <p className="capitalize text-lg">
                    {key.split("total").join(" ")}
                  </p>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{value} </p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Top Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col gap-2">
            <h2 className="h4 text-primary">Top 5 posts</h2>
            <p>Here are top posts, sorted by likes and comments</p>
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 px-16">
          <PostsCarousel posts={data.topPosts} />
        </CardContent>
      </Card>

      {/* Top Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col gap-2">
            <h2 className="h4 text-primary">Top 5 users</h2>
            <p>
              Here are top users, sorted by likes and comments and uploaded
              posts
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <TopUsers users={data.topUsers} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardWrapper;
