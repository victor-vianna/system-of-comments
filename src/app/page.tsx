"use client";
import Image from "next/image";
import React, { useState } from "react";
import ChatInput from "~/components/chatInput";
import { api } from "~/trpc/react";
import CommentsWrapper from "../components/comments/CommentsWrapper";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import ChatPage from "~/components/chats/ChatPage";

const ChatComponent = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const chatId = "12345678910";

  const {
    data: chat,
    isLoading: isChatLoading,
    isError: isChatError,
    isSuccess: isChatSuccess,
    error: chatError,
  } = api.chats.getChatById.useQuery(chatId);

  if (!isChatSuccess) return null;
  if (!selectedUser)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
        <div className="flex flex-col gap-2 rounded border border-black p-2">
          <h1 className="font-black text-cyan-500">ESCOLHA SEU PERSONAGEM</h1>
          {chat.members.map((member) => (
            <div
              onClick={() => setSelectedUser(member.userId)}
              key={member.userId}
              className="flex w-full cursor-pointer items-center gap-2 rounded border border-blue-800 px-3 py-1 duration-300 ease-in-out hover:border-cyan-500 hover:bg-blue-50"
            >
              <Avatar className="h-7 w-7">
                <AvatarImage src={member.user.avatar ?? undefined} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <h1 className="text-sm font-bold tracking-tight">
                {member.user.name}
              </h1>
            </div>
          ))}
        </div>
      </div>
    );
  return <ChatPage chat={chat} userId={selectedUser} />;
};

export default ChatComponent;
