"use client";
import Image from "next/image";
import React from "react";
import ChatInput from "~/components/chatInput";
import { api } from "~/trpc/react";
import CommentsWrapper from "../components/comments";

const ChatComponent = () => {
  const chatId = "12345678910";
  const userId = "1";
  const { data } = api.chats.getChatById.useQuery(chatId);

  return (
    <div className="flex h-full w-full flex-col p-6">
      {/* Header */}
      <div className="mb-4 border-b pb-4">
        <h1 className="text-2xl font-bold"># {data?.title}</h1>
        <p className="text-sm text-gray-600">
          Este é o início da conversa no{" "}
          <span className="font-bold">#Chat</span>. Fique à vontade para
          convidar seus colegas de equipe e iniciar a discussão.
        </p>
        <div className="mt-2 flex items-center text-sm text-gray-600">
          <div className="flex items-center justify-center rounded-full">
            {data?.author.avatar ? (
              <Image
                src={data.author.avatar}
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
              Criado por: <strong>{data?.author.name}</strong>
            </span>
          </div>
          <span className="ml-4">
            Criado em:{" "}
            {data?.createdAt
              ? new Date(data?.createdAt).toLocaleDateString("pt-br")
              : "-"}
          </span>
        </div>
      </div>
      <ChatInput chatId={chatId} userId={userId} />
      <CommentsWrapper chatId={chatId} userId={userId} />
    </div>
  );
};

export default ChatComponent;
