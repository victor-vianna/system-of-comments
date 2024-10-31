import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import CommentCard from "./CommentCard";
import { pusherClient } from "~/lib/pusher"; // Certifique-se de que o Pusher está importado corretamente
import { TChatComment, TCreateCommentOutput } from "~/types/comments";
import { TCreateCommentInput } from "~/types/comments";
import { TChatById } from "~/types/chat";

type CommentsWrapperProps = {
  chatId: string;
  userId: string;
  chatMembers: TChatById["members"];
  initialComments: TChatComment[];
};

export default function CommentsWrapper({
  chatId,
  userId,
  initialComments,
  chatMembers,
}: CommentsWrapperProps) {
  console.log(chatMembers);
  const [incomingComments, setIncomingComments] = useState<TChatComment[]>([]);

  // UseEffect para subscrever a novos comentários
  useEffect(() => {
    // Subscreva ao canal de chat do Pusher
    const channel = pusherClient.subscribe(`chat-${chatId}`);

    const handleNewComment = (data: {
      newComment: TCreateCommentOutput["data"];
    }) => {
      // console.log("NEW DATA IN WS", data);
      const commentCreatedData = data.newComment.comment;
      // console.log("COMMENTDATA", commentCreatedData);
      const commentCreatedMentions = data.newComment.mentions;
      // console.log("COMMENTMENTIONS", commentCreatedMentions);
      console.log("CHAT MEMBERS", chatMembers);
      const author = chatMembers.find((m) => {
        console.log("TESTE", m.userId, commentCreatedData.authorId);
        return m.userId == commentCreatedData.authorId;
      });
      console.log("AUTOR ENCONTRADO", author);
      const mentions: TChatComment["mentions"] = commentCreatedMentions.map(
        (mention) => {
          const equivalentUser = chatMembers.find(
            (m) => m.userId == mention.userId,
          );
          return {
            ...mention,
            user: {
              id: equivalentUser?.user.id ?? "id-holder",
              name: equivalentUser?.user.name ?? "username",
              avatar: equivalentUser?.user.avatar ?? null,
            },
          };
        },
      );
      const comment: TChatComment = {
        attachments: [],
        author: {
          avatar: author?.user.avatar ?? null,
          id: author?.user.id ?? "id-holder",
          name: author?.user.name ?? "username",
        },
        authorId: commentCreatedData.authorId,
        chatId: commentCreatedData.chatId,
        content: commentCreatedData.content,
        createdAt: commentCreatedData.createdAt ?? new Date(),
        id: commentCreatedData.id,
        mentions: mentions,
        reactions: [],
      };
      setIncomingComments((prevComments) => [...prevComments, comment]);
    };

    channel.bind("new-comment", handleNewComment);

    return () => {
      channel.unbind("new-comment", handleNewComment);
      pusherClient.unsubscribe(`chat-${chatId}`);
    };
  }, [chatId]);

  return (
    <div className="flex w-full flex-col">
      {...initialComments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} userId={userId} />
      ))}
      {incomingComments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} userId={userId} />
      ))}
    </div>
  );
}
