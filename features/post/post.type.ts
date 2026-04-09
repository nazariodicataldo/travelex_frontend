import { Comment } from "../like/like.type";
import { User } from "../user/user.type";

export type Post = {
  id: string;
  location: string;
  description: string;
  country: string;
  img: string | undefined;
  likes: number;
  countComments: number;
  author: User | undefined;
  comments: Comment[];
  likedByMe: boolean;
};
