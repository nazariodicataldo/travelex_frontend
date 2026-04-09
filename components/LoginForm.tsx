"use client";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { handleLogin } from "@/features/auth/auth.actions";
import { useAuthUserStore } from "@/features/auth/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const loginFormSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

export default function LoginForm() {
  const router = useRouter();
  const loginStore = useAuthUserStore((state) => state.login);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  });

  async function onSubmit(values: LoginFormData) {
    try {
      const session = await handleLogin(values);
      toast.success('You have been logged'); // Segna che tutto è andato bene
      /* Salvo l'utente nello store */
      loginStore(session.user, session.token);
      router.push("/");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error(
        error instanceof Error ? error.message : "Form submission error",
      );
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
        <Input
          id="password"
          placeholder="********"
          type="password"
          {...form.register("password")}
        />

        <FieldError>{form.formState.errors.password?.message}</FieldError>
      </Field>

      <Link href="/password-recovery" className="inline-block">
        Password dimenticata?
      </Link>

      <Button type="submit" className={"w-full"}>
        Accedi
      </Button>
    </form>
  );
}
