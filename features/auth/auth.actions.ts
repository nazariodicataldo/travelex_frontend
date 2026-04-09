"use server";

import { LoginFormData } from "@/components/LoginForm";
import { AuthService } from "./auth.service";
import { cookies } from "next/headers";

export async function handleLogin(values: LoginFormData) {
  const res = await AuthService.login(values);

  const token = res.token;

  if (!token) {
    throw new Error("Token non valido");
  }

  (await cookies()).set("auth-token", token, {
    httpOnly: true,
    maxAge: 60 * 60, // 1 ora -> 3600 secondi
  });

  return res;
}

export async function deleteAuthToken() {
  (await cookies()).delete("auth-token");
}

export async function getAuthToken() {
  const token = (await cookies()).get("auth-token")?.value;
  return token ?? undefined;
}

export async function handleLogout() {
  //Elimino il token lato server
  await deleteAuthToken();
}
