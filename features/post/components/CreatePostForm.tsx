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
import { useFilterStore, useSessionExpiredDialogStore } from "@/lib/store";
import { FieldDescription } from "@/components/ui/field";
import placeholder from "@/public/placeholder.jpg";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { myEnv } from "@/lib/backend";

const createPostFormSchema = z.object({
  location: z.string({ error: "Location required" }).min(1).max(60),
  description: z.string({ error: "Description required" }).min(1).max(600),
  country: z.string({ error: "Country required" }).min(1).max(3),
  img: z
    .custom<FileList | undefined>()
    .optional()
    .refine(
      //Se non c'è nessun file o questo è minore di 2 Mega, il controllo passa
      (files) => !files || files.length === 0 || files[0].size <= 2_097_152,
      {
        message: "Image can't be heavier than 2 Megabytes",
      },
    )
    .refine(
      (files) =>
        //Se non c'è nessun file o il suo tipo è tra quelli ammessi, il controllo passa
        !files ||
        files.length === 0 ||
        ["image/png", "image/jpeg", "image/webp", "image/jpg"].includes(
          files[0].type,
        ),
      {
        message: "Only PNG, JPEG, WEBP are allowed",
      },
    ),
});

export type CreatePostData = z.infer<typeof createPostFormSchema>;

type CreatePostFormProps = {
  defaultValue?: Omit<CreatePostData, "img"> & { img?: string };
  postId?: string;
};

const CreatePostForm = ({ defaultValue, postId }: CreatePostFormProps) => {
  //Prendo l'immagine attuale dal database (passata come prop al form)
  const currentImgUrl = defaultValue?.img
    ? `${myEnv.backendUrl}/${defaultValue.img}`
    : null;

  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(currentImgUrl);

  const { setOpen } = useSessionExpiredDialogStore();

  //mi prendo i filtri dallo store
  const { filters } = useFilterStore();

  const queryClient = useQueryClient();

  const { register, handleSubmit, formState, control, reset, watch, setValue } =
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
        const newData: CreatePostData & { remove_img: "false" | "true" } = {
          ...data,
          remove_img: preview ? "false" : "true",
        };
        await updatePost(postId, newData);
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
        /* toast.error(getErrorMessage(error, "Form submission error"), {
          position: "bottom-right",
        }); */
        setOpen(true);
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
        /* toast.error(
          error instanceof Error ? error.message : "Form submission error",
          { position: "bottom-right" },
        ); */
        setOpen(true);
      }
    }
  };

  //Leggo l'immagine dal form
  const fileList = watch("img");

  useEffect(() => {
    // Se l'utente seleziona un NUOVO file, crea la preview del file
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [fileList]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full md:w-sm lg:w-lg mx-auto"
    >
      {/* Ritorna al post */}
      {defaultValue && <Link href={`/posts/` + postId}>Go back to post</Link>}
      {/* Location */}
      <div className="flex flex-col gap-1">
        <label htmlFor="location" className="font-medium">
          Location <small className="text-destructive">*</small>
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
          Country <small className="text-destructive">*</small>
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
          Description <small className="text-destructive">*</small>
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

      {/* File */}
      <div className="flex flex-col gap-1">
        <label htmlFor="picture" className="font-medium">
          Image <small>Max 2 MB</small>
        </label>
        <Image
          src={preview || placeholder}
          width={500}
          height={500}
          alt="Post picture"
          unoptimized
        />
        <Input
          id="picture"
          type="file"
          accept="image/*"
          /* onChange={(e) => console.log} */
          placeholder="Select post image"
          {...register("img")}
        />
        <FieldDescription className="flex items-center justify-between">
          <span>Select a picture to upload.</span>
          {preview && (
            <Button
              variant={"destructive"}
              onClick={() => {
                if (preview) URL.revokeObjectURL(preview); // Libera la RAM subito
                //rimuovo sia l'immagine dal field e rendo null la preview
                setValue("img", undefined);
                setPreview(null);
              }}
            >
              Remove picture
            </Button>
          )}
        </FieldDescription>
        {/* Messaggio di errore per l'immagine */}
        {formState.errors.img && (
          <small aria-live="polite" className="text-destructive text-xs">
            {formState.errors.img.message}
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
