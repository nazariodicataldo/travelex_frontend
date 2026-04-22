"use server";

import { CreatePostData } from "@/features/post/components/CreatePostForm";
import { PostService } from "@/features/post/post.service";
import { Post } from "@/features/post/post.type";
import { cookies } from "next/headers";

export async function createPost(data: CreatePostData): Promise<Post> {
  const token = (await cookies()).get("auth-token")?.value;

  if (!token) throw new Error("Unauthorized");

  const file = data.img?.[0];

  const newData = {
    ...data,
    img: file,
  };

  return await PostService.store(newData, token);
}

export async function updatePost(
  postId: string,
  data: CreatePostData & { remove_img: "false" | "true" },
) {
  const token = (await cookies()).get("auth-token")?.value;

  if (!token) throw new Error("Unauthorized");

  const file = data.img?.[0];

  const newData = {
    ...data,
    img: file,
  };

  return await PostService.update(postId, newData, token);
}

export async function deletePost(postId: string): Promise<void> {
  const token = (await cookies()).get("auth-token")?.value;

  if (!token) throw new Error("Unauthorized");

  await PostService.destroy(postId, token);
}
