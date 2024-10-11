import Image from "next/image";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { TChatComment } from "~/types/comments";
import { AiOutlineLike } from "react-icons/ai";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
        <Comment key={comment.id} comment={comment} userId={userId} />
      ))}
    </div>
  );
}

type CommentProps = {
  comment: TChatComment;
  userId: string;
};

const Comment = ({ comment, userId }: CommentProps) => {
  const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);

  const utils = api.useUtils();

  const { mutate: createMutation, isPending } =
    api.reactions.createReaction.useMutation({
      onMutate: async (data) => {
        await utils.comments.getCommentsByChat.cancel();
        // Get the data from the queryCache
        const prevData = utils.comments.getCommentsByChat.getData();
        utils.comments.getCommentsByChat.setData(
          { chatId: comment.chatId },
          (old) => {
            const indexOfComment = old?.map((p) => p.id).indexOf(comment.id);
            return old?.map((comment, index) =>
              index != indexOfComment
                ? comment
                : {
                    ...comment,
                    reactions: [
                      ...comment.reactions,
                      {
                        ...data,
                        id: "id-holder",
                        user: { id: "user-id-holder", nome: "..." },
                      },
                    ],
                  },
            );
          },
        );
        return { prevData };
      },
      onSuccess: (data, err, cont) => {
        toast.success(data, {
          position: "top-center",
        });
      },
      onSettled: async () => {
        await utils.comments.getCommentsByChat.invalidate({
          chatId: comment.chatId,
        });
      },
      onError(err, newReaction, ctx) {
        toast.error(err.message);
        // If the mutation fails, use the context-value from onMutate
        utils.comments.getCommentsByChat.setData(
          { chatId: comment.chatId },
          ctx?.prevData,
        );
      },
    });
  const { mutate: deleteMutation, isPending: isDeletePending } =
    api.reactions.deleteReaction.useMutation({
      onMutate: async (data) => {
        await utils.comments.getCommentsByChat.cancel();
        // Get the data from the queryCache
        const prevData = utils.comments.getCommentsByChat.getData();
        utils.comments.getCommentsByChat.setData(
          { chatId: comment.chatId },
          (old) => {
            const indexOfComment = old?.map((p) => p.id).indexOf(comment.id);
            return old?.map((comment, index) =>
              index != indexOfComment
                ? comment
                : {
                    ...comment,
                    reactions: comment.reactions.filter((r) => r.id != data),
                  },
            );
          },
        );
        return { prevData };
      },
      onSuccess: (data, err, cont) => {
        toast.success(data, {
          position: "top-center",
        });
      },
      onSettled: async () => {
        await utils.comments.getCommentsByChat.invalidate({
          chatId: comment.chatId,
        });
      },
      onError(err, newReaction, ctx) {
        toast.error(err.message);
        // If the mutation fails, use the context-value from onMutate
        utils.comments.getCommentsByChat.setData(
          { chatId: comment.chatId },
          ctx?.prevData,
        );
      },
    });

  const reactionsCounterList = comment.reactions.reduce(
    (acc: { [key: string]: number }, current) => {
      if (!acc[current.reactionType]) acc[current.reactionType] = 0;
      acc[current.reactionType] += 1;
      return acc;
    },
    {},
  );

  function hasUserReact({
    reactionType,
    reactions,
    userId,
  }: {
    reactionType: string;
    reactions: TChatComment["reactions"];
    userId: string;
  }) {
    if (reactionType != "like") {
      console.log(reactionType);
      console.log(reactions);
    }

    return reactions.find(
      (r) => r.reactionType === reactionType && r.userId === userId,
    );
  }
  // Função para capturar o emoji
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const reactionType = emojiData.emoji; // Pega o emoji escolhido
    const userHasAlreadyReact = hasUserReact({
      reactionType,
      reactions: comment.reactions,
      userId,
    });
    console.log("REAÇÃO ENCONTRADA", userHasAlreadyReact);
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

    setEmojiPickerVisible(false); // Fecha o picker após o emoji ser selecionado
  };

  return (
    <div className="mb-4 border-b pb-4">
      <div className="flex items-start">
        {comment.author.avatar ? (
          <Image
            src={comment.author.avatar}
            width={40}
            height={40}
            alt="Avatar"
            className="rounded-full"
          />
        ) : (
          <div className="text flex h-10 w-10 items-center justify-center rounded-full bg-purple-500">
            {comment.author.name[0]?.toUpperCase()}
          </div>
        )}
        {/* conteúdo do comentário */}
        <div className="ml-4 flex-1">
          <div className="flex justify-between">
            <div>
              <span className="font-bold text-gray-900">
                {comment.author.name}
              </span>
              <p className="text-gray-600">{comment.content}</p>
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
          <div className="mt-2 flex items-center text-gray-500">
            <div className="flex items-center gap-1">
              {Object.entries(reactionsCounterList).map(([key, value]) => {
                if (key === "like")
                  return (
                    <button
                      disabled={isDeletePending}
                      key={key}
                      onClick={() => {
                        const reaction = comment.reactions.find(
                          (r) => r.reactionType == "like" && r.userId == userId,
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
            <button
              onClick={() => setEmojiPickerVisible((prev) => !prev)}
              className="ml-4 flex items-center space-x-1"
            >
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

            {/* Condicional para mostrar o Emoji Picker */}
            {isEmojiPickerVisible && (
              <div className="mt-2">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
