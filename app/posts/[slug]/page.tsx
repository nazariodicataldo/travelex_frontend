"use client";
import { useAuthUserStore } from "@/features/auth/auth.store";
import {
  useLikeMutation,
  useSinglePostQuery,
} from "@/features/post/post.queries";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
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
import { Heart, MessageCircle, Pencil, Trash2 } from "lucide-react";
import { cn, getErrorMessage } from "@/lib/utils";
import Link from "next/link";
import CommentsGrid from "@/features/comment/components/CommentsGrid";
import { myEnv } from "@/lib/backend";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { deletePost } from "@/app/actions";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useFilterStore, useSessionExpiredDialogStore } from "@/lib/store";

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
  const router = useRouter();
  const queryClient = useQueryClient();

  const { setOpen: setSessionDialogOpen } = useSessionExpiredDialogStore();

  const { mutate } = useLikeMutation();

  /* State della gestione della dialog */
  const [open, setOpen] = useState(false);
  const { user } = useAuthUserStore();
  const { filters } = useFilterStore();

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

  async function handleClick() {
    try {
      /* Server Action che chiama il service */
      await deletePost(post!.id);

      /* Toast di conferma eliminazione */
      toast.success("Post deleted successfully", {
        position: "bottom-right",
      });

      //stringify dei filtri
      const filtersStringified = JSON.stringify(filters);

      queryClient.invalidateQueries({
        queryKey: ["posts", filtersStringified],
      });

      /* Redirect sull'home page*/
      router.push("/");
    } catch (error) {
      console.error(error);
      const errorMessage = getErrorMessage(error, "Cannot delete the post");
      toast.error(errorMessage, {
        position: "bottom-right",
      });
    } finally {
      setOpen(false);
    }
  }

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
          src={post.img ? `${myEnv.backendUrl}/${post.img}` : placeholder}
          alt={post.location}
          width={500}
          height={500}
          className="aspect-square lg:aspect-video w-full object-cover"
          unoptimized
        />
        <figcaption className="flex flex-col gap-6">
          {/* Country */}
          {country !== undefined && <LocationBadge country={country} />}
          <div className="flex justify-between items-center">
            <h1 className="text-primary w-3/4">{post.location}</h1>
            {/* Actions */}
            <div className="flex gap-2">
              {/* Likes */}
              <Button
                variant={"outline"}
                onClick={() => {
                  if (!token) {
                    setSessionDialogOpen(true);
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
              {/* Only for owner */}
              {user?.id === post.author?.id && (
                <>
                  {/*  Update Post */}
                  <Button
                    variant={"ghost"}
                    nativeButton={false}
                    render={<Link href={`/update-post?postId=${post.id}`} />}
                  >
                    <Pencil />
                    Update post
                  </Button>
                  {/* Delete Post */}
                  <Dialog
                    defaultOpen={open}
                    open={open}
                    onOpenChange={() => setOpen(!open)}
                  >
                    <DialogTrigger
                      render={
                        <Button
                          variant={"destructive"}
                          onClick={() => setOpen(true)}
                        />
                      }
                    >
                      <Trash2 />
                      Delete post
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose render={<Button variant="outline" />}>
                          Cancel
                        </DialogClose>
                        <Button type="submit" onClick={() => handleClick()}>
                          Delete post
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
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
