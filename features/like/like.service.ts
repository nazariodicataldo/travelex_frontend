import { myFetch } from "@/lib/backend";

export class LikeService {
  static async toggle({ postId, token }: { postId: string; token: string }) {
    return await myFetch<void>(
      "/likes",
      {
        method: "POST",
        body: JSON.stringify({ travel_post_id: postId }),
      },
      token,
    );
  }
}
