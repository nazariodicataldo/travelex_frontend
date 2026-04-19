import { LoginFormData } from "@/components/LoginForm";
import { User } from "../user/user.type";
import { myFetch } from "@/lib/backend";
import { RegisterFormData } from "@/components/RegisterForm";
import { SendRecoveryFormData } from "@/components/SendRecoveryCodeForm";
import { ResetPasswordData } from "@/components/PasswordRecoveryForm";

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
    return await myFetch<Auth>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async forgotPassword(data: SendRecoveryFormData) {
    return await myFetch("/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async resetPassword(data: ResetPasswordData) {
    return await myFetch("/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async me(token: Auth["token"]): Promise<User> {
    return await myFetch<User>("/auth/me", undefined, token);
  }
}
