"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { pusherClient } from "~/lib/pusher";
import { api } from "~/trpc/react";

// Defina os tipos para o contexto
type PusherContextType = {
  messages: { message: string; id: string }[];
  addMessage: (newMessage: { message: string; id: string }) => void;
};

// Criação do contexto
const PusherContext = createContext<PusherContextType | undefined>(undefined);

export const PusherProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<{ message: string; id: string }[]>(
    [],
  );

  useEffect(() => {
    pusherClient.subscribe("1");

    const handleNewMessage = ({ message }: { message: string }) => {
      console.log("NOVA MENSAGEM", message);
      // Adiciona nova mensagem à lista de mensagens
      setMessages((prev) => [...prev, { message, id: Date.now().toString() }]); // Usando timestamp como ID
    };

    pusherClient.bind("new-message", handleNewMessage);

    return () => {
      pusherClient.unbind("new-message", handleNewMessage);
      pusherClient.unsubscribe("1");
    };
  }, []);

  const addMessage = (newMessage: { message: string; id: string }) => {
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <PusherContext.Provider value={{ messages, addMessage }}>
      {children}
    </PusherContext.Provider>
  );
};

// Hook para usar o contexto
export const usePusher = () => {
  const context = useContext(PusherContext);
  if (!context) {
    throw new Error("usePusher must be used within a PusherProvider");
  }
  return context;
};
