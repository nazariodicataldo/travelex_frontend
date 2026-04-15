"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Country, CountryDropdown } from "@/components/ui/CountryDropdown";
import { Button } from "@/components/ui/button";
import { createPost, updatePost } from "@/app/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useFilterStore } from "@/lib/store";

const createPostFormSchema = z.object({
  location: z.string({ error: "Location required" }).min(1).max(60),
  description: z.string({ error: "Description required" }).min(1).max(600),
  country: z.string({ error: "Country required" }).min(1).max(3),
});

export type CreatePostData = z.infer<typeof createPostFormSchema>;

type CreatePostFormProps = {
  defaultValue?: CreatePostData;
  postId?: string;
};

const CreatePostForm = ({ defaultValue, postId }: CreatePostFormProps) => {
  const router = useRouter();

  //mi prendo i filtri dallo store
  const { filters } = useFilterStore();

  const queryClient = useQueryClient();

  const { register, handleSubmit, formState, control, reset } =
    useForm<CreatePostData>({
      resolver: zodResolver(createPostFormSchema),
      defaultValues: {
        location: defaultValue?.location || "",
        country: defaultValue?.country || "",
        description: defaultValue?.description || "",
      },
    });

  const onSubmit = async (data: CreatePostData) => {
    //se ci sono i defaultValues vuol dire che sto facendo un update
    //quindi faccio una chiamata diversa
    if (defaultValue && postId) {
      try {
        await updatePost(postId, data);
        toast.success("Post has been updated", { position: "bottom-right" });
        reset();

        /* Invalidiamo la query per mostrare il post aggiornato */
        queryClient.invalidateQueries({
          queryKey: ["posts", { id: postId }],
        });

        //stringify dei filtri
        const filtersStringified = JSON.stringify(filters);

        queryClient.invalidateQueries({
          queryKey: ["posts", filtersStringified],
        });

        /* Redirect sul post appena aggiornato*/
        router.push(`/posts/${postId}`);
      } catch (error) {
        toast.error(getErrorMessage(error, "Form submission error"), {
          position: "bottom-right",
        });
      }
    } else {
      //se non ci sono, sto facendo una insert
      try {
        await createPost(data);
        toast.success("Post has been created", { position: "bottom-right" });
        reset();

        /* Invalidiamo la query per mostrare il post aggiornato */
        queryClient.invalidateQueries({
          queryKey: ["posts", { id: postId }],
        });

        //stringify dei filtri
        const filtersStringified = JSON.stringify(filters);

        queryClient.invalidateQueries({
          queryKey: ["posts", filtersStringified],
        });

        /* Redirect sull'home page*/
        router.push("/");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Form submission error",
          { position: "bottom-right" },
        );
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full md:w-sm lg:w-lg mx-auto"
    >
      {/* Location */}
      <div className="flex flex-col gap-1">
        <label htmlFor="location" className="font-medium">
          Location
        </label>
        <Input
          id="location"
          {...register("location")}
          placeholder="Your last trip"
        />
        {/* Messaggio di errore per la destizione */}
        {formState.errors.location && (
          <small aria-live="polite" className="text-destructive text-xs">
            {formState.errors.location.message}
          </small>
        )}
      </div>

      {/* Country */}
      <div className="flex flex-col gap-1">
        <label htmlFor="country" id="country-label" className="font-medium">
          Location
        </label>
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <CountryDropdown
              {...field}
              placeholder="Select country"
              defaultValue={field.value}
              id="country"
              onChange={(country: Country | undefined) => {
                if (country) field.onChange(country.alpha3);
              }}
              ariaLabelledby="country-label"
            />
          )}
        />
        {formState.errors.country && (
          <small aria-live="polite" className="text-destructive text-xs">
            {formState.errors.country.message}
          </small>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="font-medium">
          Description
        </label>
        <Textarea
          id="description"
          className="resize-none h-36"
          {...register("description")}
          placeholder="The description of your last trip"
        />
        {/* Messaggio di errore per la descrizione */}
        {formState.errors.description && (
          <small aria-live="polite" className="text-destructive text-xs">
            {formState.errors.description.message}
          </small>
        )}
      </div>

      {/* Submit */}
      <Button type="submit" disabled={formState.isSubmitting}>
        {defaultValue ? "Update post" : "Create post"}
      </Button>
    </form>
  );
};

export default CreatePostForm;
