import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Post } from "../post.type";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import placeholder from "../../../public/placeholder.jpg";

type PostProps = {
  post: Post;
};

const PostCard = ({ post }: PostProps) => {
  return (
    <Card className="relative gap-0">
      <Link
        href={`/posts/${post.id}`}
        aria-label={`Vai al post di ${post.author?.username} su ${post.location}`}
        className="z-1 inset-0 after:absolute after:inset-0 size-0"
      />
      <CardHeader className="p-0 -my-4">
        <Image
          src={post.img || placeholder}
          alt={`Featured image about ${post.author?.username}'s post`}
        />
      </CardHeader>
      <CardFooter className="flex flex-col gap-2 items-start">
        <div className="flex gap-2 z-2">
          <Button variant={'outline'} size={"icon"}>
            <Heart />
          </Button>
          <Button variant={'outline'} size={"icon"}>
            <MessageCircle />
          </Button>
        </div>
        <small>{post.author?.username}</small>
        <CardTitle>{post.location} </CardTitle>
        <CardDescription>{post.description} </CardDescription>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
