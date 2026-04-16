"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { handleRegister } from "@/features/auth/auth.actions";
import { useRouter } from "next/navigation";
import { useAuthUserStore } from "@/features/auth/auth.store";
import { getErrorMessage } from "@/lib/utils";

export const registerSchema = z.object({
  username: z.string().min(1),
  email: z.email(),
  password: z.string(),
  password_confirmation: z.string(),
  termsAndConditions: z.boolean(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const router = useRouter();
  const { login } = useAuthUserStore();

  const form = useForm<z.infer<typeof registerSchema>>({
    defaultValues: {
      termsAndConditions: false,
    },
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      console.log(values);
      const { user, token } = await handleRegister(values);
      toast.success("You have been registered"); // Segna che tutto è andato bene
      /* Salvo l'utente nello store */
      login(user, token); //auto-login per la registrazione
      router.push("/");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error(getErrorMessage(error, "Form submission error"));
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto max-w-3xl space-y-4"
    >
      <Field>
        <FieldLabel htmlFor="lastName">Username</FieldLabel>
        <Input
          id="lastName"
          placeholder="Rossi"
          {...form.register("username")}
        />

        <FieldError>{form.formState.errors.username?.message}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          placeholder="mario.rossi@example.com"
          inputMode="email"
          {...form.register("email")}
        />

        <FieldError>{form.formState.errors.email?.message}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            id="password"
            className="pr-10"
            placeholder="********"
            {...form.register("password")}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        </div>

        <FieldError>{form.formState.errors.password?.message}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor="passwordConfirmation">
          Password Confirmation
        </FieldLabel>
        <div className="relative">
          <Input
            type={showPasswordConfirmation ? "text" : "password"}
            id="passwordConfirmation"
            placeholder="********"
            {...form.register("password_confirmation")}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPasswordConfirmation((prev) => !prev)}
          >
            {showPasswordConfirmation ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="sr-only">
              {showPasswordConfirmation ? "Hide password" : "Show password"}
            </span>
          </Button>
        </div>

        <FieldError>
          {form.formState.errors.password_confirmation?.message}
        </FieldError>
      </Field>
      <Field className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
        <Checkbox
          id="termsAndConditions"
          className={"w-4!"}
          // {...form.register("termsAndConditions")}
          checked={form.watch("termsAndConditions")}
          onCheckedChange={(value) =>
            form.setValue("termsAndConditions", value)
          }
        />
        <div className="space-y-1 leading-none">
          <FieldLabel htmlFor="termsAndConditions">
            Terms and Conditions
          </FieldLabel>
          <FieldDescription>
            By activating the checkbox you accept the terms and conditions
          </FieldDescription>
          <FieldError>
            {form.formState.errors.termsAndConditions?.message}
          </FieldError>
        </div>
      </Field>
      <Button
        type="submit"
        className={"w-full"}
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? (
          <Loader2 className="animate-spin" />
        ) : (
          "Register"
        )}
      </Button>
    </form>
  );
}
