"use server";

import { getAuthToken } from "../auth/auth.actions";
import { CommentService } from "./comment.service";
import { CreateCommentData } from "./components/CreateComment";

export async function handleCommentCreation(
  data: CreateCommentData & { travel_post_id: string },
) {
  //mi prendo il token
  const token = await getAuthToken();

  if (!token) throw new Error("Unauthorized");

  return await CommentService.store(data, token);
}

export async function handleCommentDelete(commentId: string) {
  //mi prendo il token
  const token = await getAuthToken();

  if (!token) throw new Error("Unauthorized");

  return await CommentService.delete(commentId, token);
}
