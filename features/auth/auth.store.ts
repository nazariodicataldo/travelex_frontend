import { create } from "zustand";
import { User } from "../user/user.type";
import { persist } from "zustand/middleware";

type AuthState = {
  user: User | undefined;
  token: string | undefined;
  login: (user: User, token: string) => void;
  logout: () => void;
};

export const useAuthUserStore = create<AuthState>()(
  persist(
    (set) => ({
      user: undefined,
      token: undefined,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: undefined, token: undefined }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
