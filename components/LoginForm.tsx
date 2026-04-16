"use client";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { handleLogin } from "@/features/auth/auth.actions";
import { useAuthUserStore } from "@/features/auth/auth.store";
import { getErrorMessage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const loginFormSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const loginStore = useAuthUserStore((state) => state.login);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  });

  async function onSubmit(values: LoginFormData) {
    try {
      const session = await handleLogin(values);
      toast.success("You have been logged"); // Segna che tutto è andato bene
      /* Salvo l'utente nello store */
      loginStore(session.user, session.token);
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
            onClick={() => setShowPassword((prev: boolean) => !prev)}
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

      {/* <Link href="/password-recovery" className="inline-block">
        Password dimenticata?
      </Link> */}

      <Button
        type="submit"
        className={"w-full"}
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? (
          <Loader2 className="animate-spin" />
        ) : (
          "Log In"
        )}
      </Button>
    </form>
  );
}
