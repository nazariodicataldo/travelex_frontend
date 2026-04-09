import { LoginFormData } from "@/components/LoginForm";
import { http } from "@/lib/http";
import { User } from "../user/user.type";
import { myFetch } from "@/lib/backend";

type Login = {
  user: Omit<User, "password">;
  token: string;
};

export class AuthService {
  static #authTokenName = "authToken";

  static async login(data: LoginFormData) {
    return await myFetch<Login>("/auth/login", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static authToken() {
    return localStorage.getItem(this.#authTokenName);
  }

  static async me(token: Login["token"]): Promise<User> {
    return await myFetch<User>("/auth/me", undefined, token);
  }
}
