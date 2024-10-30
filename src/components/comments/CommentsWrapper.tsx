import { useEffect } from "react";
import { api } from "~/trpc/react";
import CommentCard from "./CommentCard";
import { pusherClient } from "~/lib/pusher"; // Certifique-se de que o Pusher está importado corretamente

type CommentsWrapperProps = {
  chatId: string;
  userId: string;
};

export default function CommentsWrapper({
  chatId,
  userId,
}: CommentsWrapperProps) {
  const { data: comments, refetch } = api.comments.getCommentsByChat.useQuery({
    chatId,
  });

  // UseEffect para subscrever a novos comentários
  useEffect(() => {
    // Subscreva ao canal de chat do Pusher
    const channel = pusherClient.subscribe(`chat-${chatId}`);

    const handleNewComment = (data: { comment: any }) => {
      console.log("Novo comentário recebido:", data);
      // Após receber um novo comentário, você pode chamar refetch para atualizar os comentários
      refetch();
    };

    channel.bind("new-comment", handleNewComment);

    return () => {
      channel.unbind("new-comment", handleNewComment);
      pusherClient.unsubscribe(`chat-${chatId}`);
    };
  }, [chatId, refetch]);

  return (
    <div className="flex w-full flex-col">
      {comments?.map((comment) => (
        <CommentCard key={comment.id} comment={comment} userId={userId} />
      ))}
    </div>
  );
}
