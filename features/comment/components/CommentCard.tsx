import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Comment } from "../comment.type";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const CommentCard = ({ comment }: { comment: Comment }) => {
  return (
    <Card className="bg-card">
      <CardHeader className="flex gap-2 items-center">
        <Avatar>
          <AvatarImage
            src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${comment.author?.username}`}
          />
        </Avatar>
        <p className="h6">{comment.author?.username}</p>
      </CardHeader>
      <CardContent>{comment.comment}</CardContent>
    </Card>
  );
};

export default CommentCard;
