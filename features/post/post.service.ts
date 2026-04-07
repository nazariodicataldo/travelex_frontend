import { http } from "@/lib/http";
import { Post } from "./post.type";

export type PostParams = {
  location?: string;
  country?: string;
  order?: "asc" | "desc";
  orderBy?: "created_at" | "count_likes" | "count_comments";
  perPage?: number;
  page?: number;
};

export class PostService {
  static async index(params?: PostParams): Promise<Post[]> {
    return http.get<unknown, Post[]>("/posts", {
      params,
    });
  }
}
