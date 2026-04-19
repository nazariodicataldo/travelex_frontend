"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/features/auth/auth.service";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { useRouter, useSearchParams } from "next/navigation";
import { getErrorMessage } from "@/lib/utils";

export const passwordRecoveryFormSchema = z
  .object({
    password: z
      .string()
      .min(8)
      .regex(/[a-z]/g, { error: "Devi inserire almeno una minuscola" })
      .regex(/[A-Z]/g, { error: "Devi inserire almeno una maiuscola" })
      .regex(/[0-9]/g, { error: "Devi inserire almeno un numero" })
      .regex(/[!?$&=?]/g, {
        error: "Devi inserire almeno un simbolo tra !?$&=?",
      }),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Le due password non coincidono",
    path: ["passwordConfirmation"],
  });

export type ResetPasswordData = Omit<
  z.infer<typeof passwordRecoveryFormSchema>,
  "passwordConfirmation"
> & {
  password_confirmation: string;
  email: string;
  token: string;
};

export default function PasswordRecoveryForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const userEmail = searchParams.get("email");

  //Form di registrazione
  const form = useForm<z.infer<typeof passwordRecoveryFormSchema>>({
    resolver: zodResolver(passwordRecoveryFormSchema),
  });

  async function onSubmit(values: z.infer<typeof passwordRecoveryFormSchema>) {
    try {
      const newValues: ResetPasswordData = {
        email: userEmail!,
        token: token!,
        password: values.password,
        password_confirmation: values.passwordConfirmation,
      };
      await AuthService.resetPassword(newValues);
      toast.success("Password successfully updated");
      //redirect sulla pagina di login
      router.push("/login");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error(getErrorMessage(error, "Form submission error"));
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 max-w-3xl mx-auto"
    >
      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="********"
            {...form.register("password")}
          />
          <InputGroupAddon
            className="cursor-pointer"
            align="inline-end"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </InputGroupAddon>
        </InputGroup>

        <FieldError>{form.formState.errors.password?.message}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor="passwordConfirmation">Confirm Password</FieldLabel>
        <InputGroup>
          <InputGroupInput
            type={showPasswordConfirmation ? "text" : "password"}
            id="passwordConfirmation"
            placeholder="********"
            {...form.register("passwordConfirmation")}
          />
          <InputGroupAddon
            align="inline-end"
            className="cursor-pointer"
            onClick={() =>
              setShowPasswordConfirmation(!showPasswordConfirmation)
            }
          >
            {showPasswordConfirmation ? <EyeOffIcon /> : <EyeIcon />}
          </InputGroupAddon>
        </InputGroup>

        <FieldError>
          {form.formState.errors.passwordConfirmation?.message}
        </FieldError>
      </Field>
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
