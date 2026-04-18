import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Post } from "../post.type";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import placeholder from "../../../public/placeholder.jpg";
import { countries } from "country-data-list";
import { CircleFlag } from "react-circle-flags";
import { Country } from "@/components/ui/CountryDropdown";
import { cn } from "@/lib/utils";
import { useLikeMutation } from "../post.queries";
import { useAuthUserStore } from "@/features/auth/auth.store";
import { myEnv } from "@/lib/backend";
import { CommentsDialog } from "@/features/comment/components/CommentsDialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useSessionExpiredDialogStore } from "@/lib/store";

type PostProps = {
  post: Post;
};

const PostCard = ({ post }: PostProps) => {
  const token = useAuthUserStore((state) => state.token);
  const { setOpen } = useSessionExpiredDialogStore();

  const { mutate } = useLikeMutation();

  const country = countries.all.find(
    (country: Country) => country.alpha3 === post.country,
  );

  return (
    <Card className="relative gap-0">
      <Link
        href={`/posts/${post.id}`}
        aria-label={`Vai al post di ${post.author?.username} su ${post.location}`}
        className="z-1 inset-0 after:absolute after:inset-0 size-0"
      />
      <CardHeader className="p-0 -my-4">
        <Image
          src={post.img ? `${myEnv.backendUrl}/${post.img}` : placeholder}
          width={256}
          height={256}
          className="object-cover w-full aspect-video"
          alt={`Featured image about ${post.author?.username}'s post`}
          unoptimized
        />
      </CardHeader>
      <CardFooter className="flex flex-col gap-2 items-start bg-card">
        <div className="flex gap-2 z-2">
          <Button
            variant={"outline"}
            onClick={() => {
              if (!token) {
                setOpen(true);
                return;
              }
              mutate({ postId: post.id, token });
            }}
          >
            <Heart
              className={cn(
                post.likedByMe ? "fill-red-500" : "fill-transparent",
              )}
            />{" "}
            {post.likes}
          </Button>
          <CommentsDialog post={post} />
        </div>
        <small className="flex gap-2 items-center my-2">
          <Avatar className={"size-6"}>
            <AvatarImage
              src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${post.author?.username}`}
            />
          </Avatar>
          <span>{post.author?.username}</span>
        </small>
        <CardTitle className="flex gap-2">
          {country !== undefined && (
            <CircleFlag
              countryCode={country.alpha2.toLowerCase()}
              height={20}
              width={20}
            />
          )}
          <p>{post.location}</p>
        </CardTitle>
        <CardDescription>{post.description} </CardDescription>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
