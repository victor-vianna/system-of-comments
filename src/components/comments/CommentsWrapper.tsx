import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import CommentCard from "./CommentCard";
import { pusherClient } from "~/lib/pusher"; // Certifique-se de que o Pusher está importado corretamente
import { TChatComment, TCreateCommentOutput } from "~/types/comments";
import { TCreateReactionOutput } from "~/types/reactions";
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

      setIncomingComments((prevComments) => [...prevComments, newComment]);
    };

    channel.bind("new-comment", handleNewComment);

    const handleNewReaction = (data: {
      newReaction: TCreateReactionOutput["data"];
    }) => {
      const newReaction = data.newReaction.reaction;
      const newReactionAuthor = chatMembers.find(
        (m) => m.userId === newReaction.userId,
      );
      const isReactionForChatComments = chatComments.find(
        (c) => c.id == newReaction.commentId,
      );

      // if (isReactionForChatComments) {
      //   // const newChatComments: TChatComment[] = chatComments.map(
      //   //   (chatComment) =>
      //   //     chatComment.id == newReaction.commentId
      //   //       ? {
      //   //           ...chatComment,
      //   //           reactions: [
      //   //             ...chatComment.reactions,
      //   //             {
      //   //               ...newReaction,
      //   //               user: {
      //   //                 id: newReactionAuthor?.userId || "id-holder",
      //   //                 name: newReactionAuthor?.user.name || "name-holder",
      //   //                 avatar: newReactionAuthor?.user.avatar || null,
      //   //               },
      //   //             },
      //   //           ],
      //   //         }
      //   //       : chatComment,
      //   // );
      //   setChatComments((prev) =>
      //     prev.map((chatComment) =>
      //       chatComment.id == newReaction.commentId
      //         ? {
      //             ...chatComment,
      //             reactions: [
      //               ...chatComment.reactions,
      //               {
      //                 ...newReaction,
      //                 user: {
      //                   id: newReactionAuthor?.userId ?? "id-holder",
      //                   name: newReactionAuthor?.user.name ?? "name-holder",
      //                   avatar: newReactionAuthor?.user.avatar ?? null,
      //                 },
      //               },
      //             ],
      //           }
      //         : chatComment,
      //     ),
      //   );
      // } else {
      //   setIncomingComments((prev) =>
      //     prev.map((chatComment) =>
      //       chatComment.id == newReaction.commentId
      //         ? {
      //             ...chatComment,
      //             reactions: [
      //               ...chatComment.reactions,
      //               {
      //                 ...newReaction,
      //                 user: {
      //                   id: newReactionAuthor?.userId ?? "id-holder",
      //                   name: newReactionAuthor?.user.name ?? "name-holder",
      //                   avatar: newReactionAuthor?.user.avatar ?? null,
      //                 },
      //               },
      //             ],
      //           }
      //         : chatComment,
      //     ),
      //   );
      // }

      // Atualizar a reação no comentário existente, se encontrado
      // if (commentIndex !== -1) {
      //   const updatedReactions: TChatComment["reactions"] = [
      //     ...chatComments[commentIndex].reactions,
      //     {
      //       id: newReaction.id,
      //       reactionType: newReaction.reactionType,
      //       userId: newReaction.userId,
      //       user: {
      //         id: newReaction.user.id,
      //         name: newReaction.user.name,
      //         avatar: newReaction.user.avatar,
      //       },
      //     },
      //   ];

      //   const updatedComments = [...chatComments];
      //   updatedComments[commentIndex] = {
      //     ...updatedComments[commentIndex],
      //     reactions: updatedReactions,
      //   };

      //   setChatComments(updatedComments);
      // } else {
      //   // Se o comentário estiver em incomingComments
      //   const incomingCommentIndex = incomingComments.findIndex(
      //     (comment) => comment.id === newReaction.commentId,
      //   );

      //   if (incomingCommentIndex !== -1) {
      //     const updatedIncomingReactions: TChatComment["reactions"] = [
      //       ...incomingComments[incomingCommentIndex].reactions,
      //       {
      //         id: newReaction.id,
      //         reactionType: newReaction.reactionType,
      //         userId: newReaction.userId,
      //         user: {
      //           id: newReaction.user.id,
      //           name: newReaction.user.name,
      //           avatar: newReaction.user.avatar,
      //         },
      //       },
      //     ];

      //     const updatedIncomingComments = [...incomingComments];
      //     updatedIncomingComments[incomingCommentIndex] = {
      //       ...updatedIncomingComments[incomingCommentIndex],
      //       reactions: updatedIncomingReactions,
      //     };

      //     setIncomingComments(updatedIncomingComments);
      //   }
      // }
    };

    channel.bind("new-reaction", handleNewReaction);

    return () => {
      channel.unbind("new-comment", handleNewComment);
      channel.unbind("new-reaction", handleNewReaction);
      pusherClient.unsubscribe(`chat-${chatId}`);
    };
  }, [chatId, chatMembers, chatComments, incomingComments]);

  console.log(chatComments);
  console.log(incomingComments);
  return (
    <div className="flex w-full flex-col">
      {chatComments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} userId={userId} />
      ))}
      {incomingComments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} userId={userId} />
      ))}
    </div>
  );
}
