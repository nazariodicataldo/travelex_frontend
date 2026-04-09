"use server";

import { CreatePostData } from "@/features/post/components/CreatePostForm";
import { PostService } from "@/features/post/post.service";
import { Post } from "@/features/post/post.type";
import { cookies } from "next/headers";

export async function createPost(data: CreatePostData): Promise<Post> {
  const token = (await cookies()).get("auth-token")?.value;

  if (!token) throw new Error("Non autorizzato");

  return await PostService.store(data, token);
}
