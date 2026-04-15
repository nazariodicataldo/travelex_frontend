import { Like } from "../like/like.type";
import { Post } from "../post/post.type";

export type User = {
  id: string;
  username: string;
  email: string;
  likes: Like[];
  posts: Post[];
};
