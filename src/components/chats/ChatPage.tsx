import Image from "next/image";
import React from "react";
import { api } from "~/trpc/react";
import CommentsWrapper from "../comments/CommentsWrapper";
import ChatInput from "../chatInput";
import { TChatById } from "~/types/chat";

type ChatPageProps = {
  chat: TChatById;
  userId: string;
};
function ChatPage({ chat, userId }: ChatPageProps) {
  const chatId = "12345678910";

  const { data: comments } = api.comments.getCommentsByChat.useQuery({
    chatId,
  });
  return (
    <div className="flex h-full w-full flex-col p-6">
      {/* Header */}
      <div className="mb-4 border-b pb-4">
        <h1 className="text-2xl font-bold"># {chat?.title}</h1>
        <p className="text-sm text-gray-600">
          Este é o início da conversa no{" "}
          <span className="font-bold">#Chat</span>. Fique à vontade para
          convidar seus colegas de equipe e iniciar a discussão.
        </p>
        <div className="mt-2 flex items-center text-sm text-gray-600">
          <div className="flex items-center justify-center rounded-full">
            {chat?.author.avatar ? (
              <Image
                src={chat?.author.avatar}
                width={30}
                height={30}
                alt="Avatar"
                style={{ borderRadius: "100%" }}
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-white">
                VV
              </div>
            )}

            <span className="ml-2">
              Criado por: <strong>{chat?.author.name}</strong>
            </span>
          </div>
          <span className="ml-4">
            Criado em:{" "}
            {chat?.createdAt
              ? new Date(chat?.createdAt).toLocaleDateString("pt-br")
              : "-"}
          </span>
        </div>
      </div>
      <div className="flex w-full grow flex-col">
        <CommentsWrapper
          chatId={chatId}
          userId={userId}
          chatMembers={chat?.members ?? []}
          initialComments={comments ?? []}
        />
      </div>
      <ChatInput chatId={chatId} userId={userId} />
    </div>
  );
}

export default ChatPage;
