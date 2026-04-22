"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Comment } from "../comment.type";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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
import { handleCommentDelete } from "../comment.actions";
import { toast } from "sonner";
import { useAuthUserStore } from "@/features/auth/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { useFilterStore, useSessionExpiredDialogStore } from "@/lib/store";
import { useState } from "react";
import { getErrorMessage } from "@/lib/utils";

const CommentCard = ({ comment }: { comment: Comment }) => {
  /* State della gestione della dialog */
  const [open, setOpen] = useState(false);

  const { user } = useAuthUserStore();
  //mi prendo i filtri dallo store
  const { filters } = useFilterStore();

  const { setOpen: setSessionDialogOpen } = useSessionExpiredDialogStore();

  const queryClient = useQueryClient();

  async function handleClick() {
    try {
      /* Server Action che chiama il service */
      await handleCommentDelete(comment.id);
      /* Toast di conferma eliminazione */
      toast.success("Comment deleted successfully", {
        position: "bottom-right",
      });

      /* Invalidiamo la query per mostrare il post aggiornato */
      queryClient.invalidateQueries({
        queryKey: ["posts", { id: comment.postId }],
      });

      //stringify dei filtri
      const filtersStringified = JSON.stringify(filters);

      queryClient.invalidateQueries({
        queryKey: ["posts", filtersStringified],
      });
    } catch (error) {
      /* console.error(error);
      const errorMessage = getErrorMessage(error, "Cannot delete the comment");
      toast.error(errorMessage, {
        position: "bottom-right",
      }); */
      setSessionDialogOpen(true);
    } finally {
      setOpen(false);
    }
  }

  return (
    <Card className="bg-card">
      <CardHeader className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Avatar>
            <AvatarImage
              src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${comment.author?.username}`}
            />
          </Avatar>
          <p className="h6">{comment.author?.username}</p>
        </div>
        {user?.id === comment.author?.id && (
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
                  aria-label="Delete the comment"
                />
              }
            >
              <Trash2 />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>
                  Cancel
                </DialogClose>
                <Button type="submit" onClick={() => handleClick()}>
                  Delete comment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>{comment.comment}</CardContent>
    </Card>
  );
};

export default CommentCard;
