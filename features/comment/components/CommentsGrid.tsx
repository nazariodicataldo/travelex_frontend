import { Post } from "@/features/post/post.type";
import CommentCard from "@/features/comment/components/CommentCard";
import CreateComment from "./CreateComment";
import { cn } from "@/lib/utils";

const CommentsGrid = ({
  post,
  className,
}: {
  post: Post;
  className?: string;
}) => {
  return (
    <div
      id="comments-box"
      className={cn("flex w-full mt-8 flex-col gap-4", className)}
    >
      <div className="flex flex-col gap-4 items-start">
        <p className="h6">Comments ({post.commentsCount})</p>
        <CreateComment postId={post.id} />
      </div>

      {/* Zero commenti */}
      {post.commentsCount === 0 && (
        <div className="min-h-[15vw] flex items-center justify-center">
          <p className="text-muted-foreground italic">
            No comments found. Be the first to comment
          </p>
        </div>
      )}

      {post.commentsCount > 0 &&
        post.comments.map((comment, pos) => (
          <CommentCard key={pos} comment={comment} />
        ))}
    </div>
  );
};

export default CommentsGrid;
