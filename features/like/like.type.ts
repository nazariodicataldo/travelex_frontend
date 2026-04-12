import { Post } from "../post/post.type";
import { User } from "../user/user.type";

export type Like = {
  comment: string;
  post: Post | undefined;
  user: User | undefined
};
