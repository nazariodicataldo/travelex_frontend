import { LoginFormData } from "@/components/LoginForm";
import { http } from "@/lib/http";
import { User } from "../user/user.type";
import { myFetch } from "@/lib/backend";
import { RegisterFormData } from "@/components/RegisterForm";

type Auth = {
  user: Omit<User, "password">;
  token: string;
};

export class AuthService {
  static async login(data: LoginFormData) {
    return await myFetch<Auth>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async register(data: RegisterFormData) {
    return await myFetch<Auth>
  }

  static async me(token: Auth["token"]): Promise<User> {
    return await myFetch<User>("/auth/me", undefined, token);
  }
}
