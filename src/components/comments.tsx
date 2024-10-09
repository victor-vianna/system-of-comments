import Image from "next/image";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { TChatComment } from "~/types/comments";
import { AiOutlineLike } from "react-icons/ai";
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
  const utils = api.useUtils();
  const { mutate, isPending } = api.reactions.createReaction.useMutation({
    onMutate: async () => {
      await utils.comments.getCommentsByChat.cancel();
    },
    onSuccess: (data) => {
      toast.success(data, { position: "top-center" });
    },
    onSettled: async () => {
      await utils.comments.getCommentsByChat.invalidate({
        chatId: comment.chatId,
      });
    },
  });

  const reactionsCounterList = comment.reactions.reduce(
    (acc: { [key: string]: number }, current) => {
      if (!acc[current.reactionType]) acc[current.reactionType] = 0;
      // @ts-ignore
      acc[current.reactionType] += 1;
      return acc;
    },
    {},
  );
  console.log("COMMENT", comment.content, reactionsCounterList);
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
          <div className="mt-2 flex items-center text-gray-500">
            {Object.entries(reactionsCounterList).map(([key, value]) => {
              if (key == "like")
                return (
                  <div
                    key={key}
                    className="flex items-center gap-1 rounded-lg border border-cyan-500 p-2 text-xs text-cyan-500"
                  >
                    <AiOutlineLike />
                    <h1>{value}</h1>
                  </div>
                );
            })}
            {comment.reactions.find(
              (r) => r.reactionType == "like" && r.userId == userId,
            ) ? null : (
              <button
                onClick={() =>
                  mutate({
                    chatId: comment.chatId,
                    commentId: comment.id,
                    reactionType: "like",
                    userId: userId,
                    createdAt: new Date(),
                  })
                }
                className="flex items-center space-x-1"
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
                    d="M14 9l-6 6m0 0l-6-6m6 6v3"
                  />
                </svg>
                <span>Curtir</span>
              </button>
            )}

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
            {/* <button className="ml-4">Responder</button> */}
          </div>
        </div>
      </div>
    </div>
  );
};
