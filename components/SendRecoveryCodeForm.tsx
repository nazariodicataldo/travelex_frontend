"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthService } from "@/features/auth/auth.service";
import { useState } from "react";
import Link from "next/link";

export const sendRecoveryFormSchema = z.object({
  email: z.email(),
});

export type SendRecoveryFormData = z.infer<typeof sendRecoveryFormSchema>;

export default function SendRecoveryCodeForm() {
  //Form di registrazione
  const form = useForm<SendRecoveryFormData>({
    resolver: zodResolver(sendRecoveryFormSchema),
  });

  const [userEmail, setUserEmail] = useState("");

  async function onSubmit(values: SendRecoveryFormData) {
    try {
      await AuthService.forgotPassword(values);
      setUserEmail(values.email);
      /* toast.success(
        "If the provided email address exists you'll receive a password reset link",
      ); */
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  if (userEmail) {
    return (
      <div className="p-4 flex justify-center items-center">
        <p className="text-lg">
          If the provided email address exists you`&apos;`ll receive a password
          reset link
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 max-w-3xl mx-auto"
    >
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          inputMode="email"
          placeholder="mario.rossi@example.com"
          {...form.register("email")}
        />
        <FieldError>{form.formState.errors.email?.message}</FieldError>
      </Field>

      <Link href="/login" className="inline-block">
        Go back to login
      </Link>

      <Button
        type="submit"
        className={"w-full"}
        disabled={form.formState.isSubmitting}
      >
        Submit
      </Button>
    </form>
  );
}
