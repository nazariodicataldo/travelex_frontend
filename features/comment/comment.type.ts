import { Post } from "../post/post.type";
import { User } from "../user/user.type";

export type Comment = {
  id: string;
  comment: string;
  postId: Post["id"];
  //post: Post | undefined;
  author: User | undefined;
};
