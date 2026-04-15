import { myFetch } from "@/lib/backend";
import { User } from "./user.type";

export class UserService {
  static async show(userId: string, token: string): Promise<User> {
    return await myFetch<User>(`/users/${userId}`, undefined, token);
  }
}
