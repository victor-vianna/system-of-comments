import { api } from "~/trpc/react";
import CommentCard from "./CommentCard";

type CommentsWrapperProps = {
  chatId: string;
  userId: string;
};

export default function CommentsWrapper({
  chatId,
  userId,
}: CommentsWrapperProps) {
  const { data: comments } = api.comments.getCommentsByChat.useQuery({
    chatId,
  });

  return (
    <div className="flex w-full flex-col">
      {comments?.map((comment) => (
        <CommentCard key={comment.id} comment={comment} userId={userId} />
      ))}
    </div>
  );
}
