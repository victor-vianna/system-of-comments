import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import CommentCard from "./CommentCard";
import { pusherClient } from "~/lib/pusher"; // Certifique-se de que o Pusher está importado corretamente
import { TChatComment, TCreateCommentOutput } from "~/types/comments";
import {
  TCreateReactionOutput,
  TDeleteReactionOutput,
} from "~/types/reactions";
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
  console.log(initialComments);
  const [commentsHolder, setCommentsHolder] = useState(initialComments);
  const [incomingComments, setIncomingComments] = useState<TChatComment[]>([]);
  const [chatComments, setChatComments] =
    useState<TChatComment[]>(initialComments);

  useEffect(() => {
    // Subscreva ao canal de chat do Pusher
    const channel = pusherClient.subscribe(`chat-${chatId}`);

    const handleNewComment = (data: {
      newComment: TCreateCommentOutput["data"];
    }) => {
      const commentCreatedData = data.newComment.comment;
      const commentCreatedMentions = data.newComment.mentions;
      const author = chatMembers.find(
        (m) => m.userId === commentCreatedData.authorId,
      );
      const mentions: TChatComment["mentions"] = commentCreatedMentions.map(
        (mention) => {
          const equivalentUser = chatMembers.find(
            (m) => m.userId === mention.userId,
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
      const newComment: TChatComment = {
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
        mentions,
        reactions: [],
      };
      setCommentsHolder((prevComments) => [...prevComments, newComment]);
    };
    channel.bind("new-comment", handleNewComment);

    const handleNewReaction = (data: {
      newReaction: TCreateReactionOutput["data"];
    }) => {
      console.log("NEW REACTION", data);
      const newReaction = data.newReaction.reaction;
      const newReactionAuthor = chatMembers.find(
        (m) => m.userId === newReaction.userId,
      );

      setCommentsHolder((prev) =>
        prev.map((chatComment) =>
          chatComment.id == newReaction.commentId
            ? {
                ...chatComment,
                reactions: [
                  ...chatComment.reactions,
                  {
                    ...newReaction,
                    user: {
                      id: newReactionAuthor?.userId ?? "id-holder",
                      name: newReactionAuthor?.user.name ?? "name-holder",
                      avatar: newReactionAuthor?.user.avatar ?? null,
                    },
                  },
                ],
              }
            : chatComment,
        ),
      );
    };
    channel.bind("new-reaction", handleNewReaction);

    const handleDeleteReaction = (data: {
      removedReaction: TDeleteReactionOutput["data"];
    }) => {
      console.log("DELETED REACTION", data);
      const removedReaction = data.removedReaction.reaction;

      setCommentsHolder((prev) =>
        prev.map((chatComment) =>
          chatComment.id === removedReaction.commentId
            ? {
                ...chatComment,
                reactions: chatComment.reactions.filter(
                  (reaction) => reaction.id !== removedReaction.id,
                ),
              }
            : chatComment,
        ),
      );
    };

    // Vincular a função `handleDeleteReaction` ao evento de exclusão de reação
    channel.bind("removed-reaction", handleDeleteReaction);

    return () => {
      channel.unbind("new-comment", handleNewComment);
      channel.unbind("new-reaction", handleNewReaction);
      channel.unbind("removed-reaction", handleDeleteReaction);
      pusherClient.unsubscribe(`chat-${chatId}`);
    };
  }, [chatId]);

  return (
    <div className="flex w-full flex-col">
      {commentsHolder.map((comment) => (
        <CommentCard key={comment.id} comment={comment} userId={userId} />
      ))}
      {/* {incomingComments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} userId={userId} />
      ))} */}
    </div>
  );
}
