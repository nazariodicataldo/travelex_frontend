import { Button } from "@/components/ui/button";
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
import { Post } from "@/features/post/post.type";
import { MessageCircle } from "lucide-react";
import CommentsGrid from "./CommentsGrid";

export function CommentsDialog({ post }: { post: Post }) {
  return (
    <Dialog>
      <DialogTrigger
        render={<Button variant={"outline"} className={"text-foreground"} />}
      >
        <MessageCircle />
        {post.commentsCount}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle
            className={"text-lg font-medium"}
          >{`Comments on ${post.author?.username}'s post`}</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[50vh] overflow-y-auto p-4">
          {/* Griglia di commenti */}
          <CommentsGrid post={post} />
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose render={<Button type="button">Close</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
