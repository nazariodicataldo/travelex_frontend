import { myFetch } from "@/lib/backend";
import { CreateCommentData } from "./components/CreateComment";
import { Comment } from "./comment.type";

export class CommentService {
  static async store(data: CreateCommentData, token: string) {
    return await myFetch<Comment>(
      "/comments",
      {
        body: JSON.stringify(data),
        method: "POST",
      },
      token,
    );
  }

  static async delete(commentId: string, token: string) {
    return await myFetch<null>(
      `/comments/${commentId}`,
      {
        method: "DELETE",
      },
      token,
    );
  }
}
