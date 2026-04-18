import { myFetch } from "@/lib/backend";
import { Dashboard } from "./dashboard.type";

export class DashboardService {
  static async index(token: string) {
    return await myFetch<Dashboard>("/dashboard", undefined, token);
  }
}
