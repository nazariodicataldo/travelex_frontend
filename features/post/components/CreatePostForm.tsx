"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Country, CountryDropdown } from "@/components/ui/CountryDropdown";
import { Button } from "@/components/ui/button";
import { createPost } from "@/app/actions";
import { toast } from "sonner";
import axios from "axios";
import { redirect } from "next/navigation";

const createPostFormSchema = z.object({
  location: z.string({ error: "Location required" }).min(1).max(30),
  description: z.string({ error: "Description required" }).min(1).max(30),
  country: z.string({ error: "Country required" }).min(1).max(30),
});

export type CreatePostData = z.infer<typeof createPostFormSchema>;

const CreatePostForm = () => {
  const { register, handleSubmit, formState, control, reset } =
    useForm<CreatePostData>({
      resolver: zodResolver(createPostFormSchema),
    });

  const onSubmit = async (data: CreatePostData) => {
    try {
      await createPost(data);
      toast.success("Post has been created", { position: "bottom-right" });
      reset();

      /* Redirect sull'home page*/
      redirect("/");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Form submission error",
        { position: "bottom-right" },
      );
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
              onChange={(country: Country) => {
                field.onChange(country.alpha3);
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
      <Button type="submit">Create post</Button>
    </form>
  );
};

export default CreatePostForm;
