import { Post } from "./post.type";
import { CreatePostData } from "./components/CreatePostForm";
import { myFetch } from "@/lib/backend";

export type PostParams = {
  location?: string;
  country?: string;
  order?: "asc" | "desc";
  orderBy?: "created_at" | "count_likes" | "count_comments";
  perPage?: number;
  page?: number;
};

export class PostService {
  static async index(params?: PostParams, token?: string): Promise<Post[]> {
    const queryParams = [];

    //Verifico se ci sono dei parametri
    if (params && Object.keys(params).length) {
      for (const [key, value] of Object.entries(params)) {
        //Verifico che value esista
        if (value) {
          //Mi creo l'array di query params
          queryParams.push(`${key}=${value}`);
        }
      }
    }

    //Url finale
    const url = queryParams.length
      ? `/posts?${queryParams.join("&")}`
      : `/posts`;

    return await myFetch<Post[]>(url, undefined, token);
  }

  static async show(id: string, token?: string): Promise<Post> {
    return myFetch<Post>(`/posts/${id}`, undefined, token);
  }

  static async store(data: CreatePostData, token: string): Promise<Post> {
    /* return http.post<unknown, Post>("/posts", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }); */

    return await myFetch<Post>(
      "/posts",
      {
        body: JSON.stringify(data),
        method: "POST",
      },
      token,
    );
  }

  static async update(
    postId: Post["id"],
    data: CreatePostData,
    token: string,
  ): Promise<Post> {
    const url = `/posts/${postId}`;

    return await myFetch<Post>(
      url,
      {
        body: JSON.stringify(data),
        method: "PUT",
      },
      token,
    );
  }

  static async destroy(postId: Post["id"], token: string): Promise<void> {
    await myFetch<null>(
      `/posts/${postId}`,
      {
        method: "DELETE",
      },
      token,
    );
  }
}
