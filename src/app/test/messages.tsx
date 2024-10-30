"use client";
import React, { useEffect, useState } from "react";
import { pusherClient } from "~/lib/pusher";
import { api } from "~/trpc/react";

type MessagesPageProps = {
  initialMessages: {
    message: string;
    id: string;
  }[];
};
function MessagesPage({ initialMessages }: MessagesPageProps) {
  console.log("INITAL MESSAGES", initialMessages);
  const [incomingMessages, setIncomingMessages] = useState<
    { message: string }[]
  >([]);

  useEffect(() => {
    pusherClient.subscribe("1");

    const handleNewMessage = ({ message }: { message: string }) => {
      //pusherClient.bind("new-message", ({ message }: { message: string }) => {
      console.log("NOVA MENSAGEM", message);
      setIncomingMessages((prev) => [...prev, { message }]);
    };

    pusherClient.bind("new-message", handleNewMessage);

    return () => {
      pusherClient.unbind("new-message", handleNewMessage);
      pusherClient.unsubscribe("1");
    };
  }, []);
  return (
    <div className="flex h-full w-full grow flex-col items-center gap-2">
      <div className="flex w-full grow flex-col gap-2">
        {initialMessages.map((message) => (
          <div
            key={message.id}
            className="flex w-full items-center justify-center"
          >
            {message.message}
          </div>
        ))}
        {incomingMessages.map((message, index) => (
          <div key={index} className="flex w-full items-center justify-center">
            {message.message}
          </div>
        ))}
      </div>

      <NewMessageInput />
    </div>
  );
}

export default MessagesPage;

function NewMessageInput() {
  const [infoHolder, setInfoHolder] = useState<{ message: string }>({
    message: "",
  });

  function resetInfoHolder() {
    setInfoHolder({
      message: "",
    });
  }
  const { mutate, isPending } = api.tests.createMessage.useMutation({
    onSuccess: () => resetInfoHolder(),
  });
  return (
    <div className="gap-2rounded flex w-[90%] flex-col border border-black p-3 lg:w-[70%]">
      <textarea
        value={infoHolder.message}
        placeholder="Preencha aqui sua mensagem..."
        onChange={(e) =>
          setInfoHolder((prev) => ({ ...prev, message: e.target.value }))
        }
        className="w-full resize-none text-sm outline-none"
      />
      <div className="flex w-full items-center justify-end">
        <button
          onClick={() => mutate(infoHolder)}
          disabled={isPending}
          className="rounded bg-black px-2 py-1 text-xs text-white"
        >
          ENVIAR MENSAGEM
        </button>
      </div>
    </div>
  );
}
