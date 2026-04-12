import { Comment } from "../comment/comment.type";
import { User } from "../user/user.type";

export type Post = {
  id: string;
  location: string;
  description: string;
  country: string;
  img: string | undefined;
  likes: number;
  commentsCount: number;
  author: User | undefined;
  comments: Comment[];
  likedByMe: boolean;
};
