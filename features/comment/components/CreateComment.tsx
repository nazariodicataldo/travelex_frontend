import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { handleCommentCreation } from "../comment.actions";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useFilterStore } from "@/lib/store";

const createCommentSchema = z.object({
  comment: z.string().min(3).max(600),
});

export type CreateCommentData = z.infer<typeof createCommentSchema>;

export default function CreateComment({ postId }: { postId: string }) {
  const { control, handleSubmit, reset, formState } =
    useForm<CreateCommentData>({
      resolver: zodResolver(createCommentSchema),
    });

  //mi prendo i filtri dallo store
  const { filters } = useFilterStore();

  const queryClient = useQueryClient();

  async function onSubmit(data: CreateCommentData) {
    try {
      const newData = { ...data, travel_post_id: postId };
      await handleCommentCreation(newData);
      toast.success("Comment has been created", { position: "bottom-right" });
      reset();

      // invalido sia la query per il singolo post che le query di tutti i post
      queryClient.invalidateQueries({
        queryKey: ["posts", { id: postId }],
      });

      //stringify dei filtri
      const filtersStringified = JSON.stringify(filters);

      queryClient.invalidateQueries({
        queryKey: ["posts", filtersStringified],
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Form submission error",
        { position: "bottom-right" },
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full relative">
      <FieldGroup>
        <Controller
          name="comment"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="comment">Your comment</FieldLabel>
              <Textarea
                {...field}
                id="comment"
                aria-invalid={fieldState.invalid}
                placeholder="Write your comment on the post..."
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Button
        type="submit"
        disabled={formState.isSubmitting}
        className={"absolute right-2 top-12"}
      >
        {formState.isSubmitting ? "Loading..." : "Leave comment"}
      </Button>
    </form>
  );
}
