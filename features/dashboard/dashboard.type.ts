import { Post } from "../post/post.type";
import { User } from "../user/user.type";

export type Dashboard = {
  stats: {
    totalUsers: number;
    totalPosts: number;
    totalComments: number;
    totalLikes: number;
  };
  topPosts: Post[];
  topUsers: User[];
};
