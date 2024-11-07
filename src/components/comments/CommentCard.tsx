import React from "react";
import { TChatComment } from "~/types/comments";
import Image from "next/image";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { AiOutlineLike } from "react-icons/ai";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AtSign } from "lucide-react";
import {
  formatContentWithoutMentionMarker,
  formatMention,
  isTextMention,
} from "~/lib/mentions";
type CommentProps = {
  comment: TChatComment;
  userId: string;
};

const CommentCard = ({ comment, userId }: CommentProps) => {
  const utils = api.useUtils();

  const { mutate: createMutation, isPending } =
    api.reactions.createReaction.useMutation({
      // onMutate: async (data) => {
      //   await utils.comments.getCommentsByChat.cancel();
      //   // Get the data from the queryCache
      //   const prevData = utils.comments.getCommentsByChat.getData();
      //   utils.comments.getCommentsByChat.setData(
      //     { chatId: comment.chatId },
      //     (old) => {
      //       const indexOfComment = old?.map((p) => p.id).indexOf(comment.id);
      //       return old?.map((comment, index) =>
      //         index != indexOfComment
      //           ? comment
      //           : {
      //               ...comment,
      //               reactions: [
      //                 ...comment.reactions,
      //                 {
      //                   ...data,
      //                   id: "id-holder",
      //                   user: {
      //                     id: "user-id-holder",
      //                     name: "...",
      //                     avatar: null,
      //                   },
      //                 },
      //               ],
      //             },
      //       );
      //     },
      //   );
      //   return { prevData };
      // },
      onSuccess: (data, err, cont) => {
        toast.success(data.message, {
          position: "top-center",
        });
      },
      // onSettled: async () => {
      //   await utils.comments.getCommentsByChat.invalidate({
      //     chatId: comment.chatId,
      //   });
      // },
      // onError(err, newReaction, ctx) {
      //   toast.error(err.message);
      //   // If the mutation fails, use the context-value from onMutate
      //   utils.comments.getCommentsByChat.setData(
      //     { chatId: comment.chatId },
      //     ctx?.prevData,
      //   );
      // },
    });
  const { mutate: deleteMutation, isPending: isDeletePending } =
    api.reactions.deleteReaction.useMutation({
      // onMutate: async (data) => {
      //   await utils.comments.getCommentsByChat.cancel();
      //   // Get the data from the queryCache
      //   const prevData = utils.comments.getCommentsByChat.getData();
      //   utils.comments.getCommentsByChat.setData(
      //     { chatId: comment.chatId },
      //     (old) => {
      //       const indexOfComment = old?.map((p) => p.id).indexOf(comment.id);
      //       return old?.map((comment, index) =>
      //         index != indexOfComment
      //           ? comment
      //           : {
      //               ...comment,
      //               reactions: comment.reactions.filter((r) => r.id != data),
      //             },
      //       );
      //     },
      //   );
      //   return { prevData };
      // },
      onSuccess: (data, err, cont) => {
        toast.success(data.message, {
          position: "top-center",
        });
      },
      // onSettled: async () => {
      //   await utils.comments.getCommentsByChat.invalidate({
      //     chatId: comment.chatId,
      //   });
      // },
      // onError(err, newReaction, ctx) {
      //   toast.error(err.message);
      //   // If the mutation fails, use the context-value from onMutate
      //   utils.comments.getCommentsByChat.setData(
      //     { chatId: comment.chatId },
      //     ctx?.prevData,
      //   );
      // },
    });
  const reactionsCounterList = comment.reactions.reduce(
    (acc: Record<string, number>, current) => {
      acc[current.reactionType] = (acc[current.reactionType] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const hasUserReact = ({
    reactionType,
    reactions,
    userId,
  }: {
    reactionType: string;
    reactions: TChatComment["reactions"];
    userId: string;
  }) => {
    return reactions.find(
      (r) => r.reactionType === reactionType && r.userId === userId,
    );
  };
  // Função para capturar o emoji
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const reactionType = emojiData.emoji; // Pega o emoji escolhido
    const userHasAlreadyReact = hasUserReact({
      reactionType,
      reactions: comment.reactions,
      userId,
    });
    if (!userHasAlreadyReact) {
      createMutation({
        chatId: comment.chatId,
        commentId: comment.id,
        reactionType, // Usa o emoji como o tipo de reação
        userId: userId,
        createdAt: new Date(),
      });
    } else {
      deleteMutation(userHasAlreadyReact.id);
    }
  };

  // const highlightMentions = (
  //   text: string,
  //   mentions: TChatComment["mentions"],
  // ) => {
  //   let formattedText = text;
  //   mentions.forEach((m) => {
  //     const userName = m.user.name;
  //     formattedText = formattedText.replaceAll(
  //       `@${userName}`,
  //       `[@${userName.replaceAll(" ", "_")}] `,
  //     );
  //   });

  //   const mentionRegex = /(@\w+(\s\w+)?)/g; // detecta palavras que começam com "@"
  //   return formattedText.split(" ").map((part, index) => {
  //     console.log("PART", part);
  //     if (part.startsWith("[") && part.endsWith("]")) {
  //       return (
  //         <span key={index} className="italic text-blue-500">
  //           {part.replaceAll("_", " ").replaceAll("[", "").replaceAll("]", "")}
  //         </span>
  //       );
  //     }
  //     return `${part} `;
  //   });

  const highlightMentions = (
    text: string,
    mentions: TChatComment["mentions"],
  ) => {
    let formattedText = text;
    mentions.forEach((mention) => {
      const userName = mention.user.name;
      formattedText = formattedText.replaceAll(
        `@${userName}`,
        formatMention(`@${userName}`),
      );
    });

    return formattedText
      .split(/(\[\/\*.*?\*\/\])/)
      .filter((s) => s.trim().length > 0)
      .map((text, index) => {
        if (isTextMention(text))
          return (
            <span key={index} className="font-bold text-blue-500">
              {formatContentWithoutMentionMarker(text)}
            </span>
          );
        return text;
      });
    // const mentionRegex = /(@\w+(\s\w+)?)/g;
    // const mentionedNames = new Set();
    // return text.split(mentionRegex).map((part, index) => {
    //   if (mentionRegex.test(part)) {
    //     const name = part.replace("@", "");
    //     if (!mentionedNames.has(name)) {
    //       mentionedNames.add(name);
    //       return (
    //         <span key={index} className="italic text-blue-500">
    //           {part}
    //         </span>
    //       );
    //     }
    //     return null;
    //   }
    //   return part;
    // });
  };

  return (
    <div className="mb-4 border-b pb-4">
      <div className="flex items-start">
        <Avatar className="h-10 w-10">
          <AvatarImage src={comment.author.avatar ?? undefined} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        {/* conteúdo do comentário */}
        <div className="ml-4 flex-1">
          <div className="flex justify-between">
            <div>
              <span className="font-bold text-gray-900">
                {comment.author.name}
              </span>
              <p className="text-gray-600">
                {highlightMentions(comment.content, comment.mentions)}
              </p>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(comment.createdAt).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* Interações */}

          {/* like após click */}
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Object.entries(reactionsCounterList).map(([key, value]) => {
                  if (key === "like")
                    return (
                      <button
                        disabled={isDeletePending}
                        key={key}
                        onClick={() => {
                          const reaction = comment.reactions.find(
                            (r) =>
                              r.reactionType == "like" && r.userId == userId,
                          );
                          if (!reaction) return;
                          else deleteMutation(reaction.id);
                        }}
                        className="flex items-center gap-1 rounded-lg border border-cyan-500 px-2 py-0.5 text-[0.6rem] text-cyan-500"
                      >
                        <AiOutlineLike />
                        <h1>{value}</h1>
                      </button>
                    );
                  else
                    return (
                      <button
                        key={key}
                        disabled={isDeletePending}
                        onClick={() => {
                          const reaction = comment.reactions.find(
                            (r) => r.reactionType == key && r.userId == userId,
                          );
                          if (!reaction) return;
                          else deleteMutation(reaction.id);
                        }}
                        className="flex items-center gap-1 rounded-lg border border-cyan-500 px-2 py-0.5 text-[0.6rem] text-cyan-500"
                      >
                        {key}
                        <h1>{value}</h1>
                      </button>
                    );
                })}
              </div>

              {/* Botão de curtir */}
              {hasUserReact({
                reactionType: "like",
                reactions: comment.reactions,
                userId,
              }) ? null : (
                <button
                  disabled={isPending}
                  onClick={() =>
                    createMutation({
                      chatId: comment.chatId,
                      commentId: comment.id,
                      reactionType: "like",
                      userId: userId,
                      createdAt: new Date(),
                    })
                  }
                  className="flex items-center space-x-1"
                >
                  <AiOutlineLike />
                  <span>Curtir</span>
                </button>
              )}

              {/* emoji picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="ml-4 flex items-center space-x-1">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 12h14M5 12l7-7m-7 7l7 7"
                      />
                    </svg>
                    <span>Reações</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="mt-2">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                </PopoverContent>
              </Popover>
              {/* Condicional para mostrar o Emoji Picker */}
            </div>
            <div className="flex items-center gap-2">
              <AtSign width={15} height={15} />
              {comment.mentions.map((m) => (
                <div key={m.id} className="flex items-center gap-1">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={m.user.avatar ?? undefined} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
