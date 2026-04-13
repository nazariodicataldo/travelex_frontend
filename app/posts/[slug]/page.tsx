"use client";
import { useAuthUserStore } from "@/features/auth/auth.store";
import {
  useLikeMutation,
  useSinglePostQuery,
} from "@/features/post/post.queries";
import Image from "next/image";
import { useParams } from "next/navigation";
import placeholder from "@/public/placeholder.jpg";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Country } from "@/components/ui/CountryDropdown";
import { countries } from "country-data-list";
import { CircleFlag } from "react-circle-flags";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import CommentsGrid from "@/features/comment/components/CommentsGrid";
import { SessionExpiredError } from "@/lib/backend";

function LocationBadge({ country }: { country: Country }) {
  return (
    <Badge className="p-4 gap-2" variant={"ghost"}>
      <CircleFlag
        countryCode={country.alpha2.toLowerCase()}
        height={32}
        width={32}
      />
      <p className="text-[1rem]">{country.name}</p>
    </Badge>
  );
}

export default function SinglePost() {
  //mi prendo l'id tramite la rotta
  const params = useParams();
  const { token } = useAuthUserStore();

  const { mutate } = useLikeMutation();

  const {
    data: post,
    isLoading,
    isError,
  } = useSinglePostQuery(params.slug as string, token);

  if (isLoading) {
    return <p>Loading post...</p>;
  }

  if (isError || !post) {
    return <p>Cannot retrive the post</p>;
  }

  const country = countries.all.find(
    (country: Country) => country.alpha3 === post.country,
  );

  return (
    <section>
      {/* breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{post.location}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <figure className="flex gap-4 mt-2 flex-col">
        <Image
          src={post.img || placeholder}
          alt={post.location}
          width={500}
          height={500}
          className="aspect-square lg:aspect-video w-full object-cover"
        />
        <figcaption className="flex flex-col gap-6">
          {/* Country */}
          {country !== undefined && <LocationBadge country={country} />}
          <div className="flex justify-between items-center">
            <h1 className="text-primary w-3/4">{post.location}</h1>
            {/* Actions */}
            <div className="flex gap-2">
              {/* Only for owner */}
              {/* Delete Post */}
              {/* Likes */}
              <Button
                variant={"outline"}
                onClick={() => {
                  if (!token) throw new SessionExpiredError();
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
              {/* Comments */}
              <Button
                variant={"outline"}
                nativeButton={false}
                className={"text-foreground"}
                render={<Link href={`/posts/${post.id}#comments-box`} />}
              >
                <MessageCircle />
                {post.commentsCount}
              </Button>
            </div>
          </div>
          <p className="text-lg text-card-foreground">{post.description}</p>
        </figcaption>
      </figure>

      {/* Comments */}
      <CommentsGrid post={post} />
    </section>
  );
}
