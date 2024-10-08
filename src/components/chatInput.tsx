// src/components/ChatInput.tsx
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

const ChatInput = ({ chatId }: { chatId: string }) => {
  const [comment, setComment] = useState("");
  const { mutate } = api.comments.createComment.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Verifica se o comentário não está vazio antes de enviar
    if (comment.trim() === "") return;

    // Envia o comentário usando a mutação do TRPC
    mutate({
      content: comment,
      chatId: chatId,
      authorId: "1", // Alterar para o ID real do usuário
    });

    // Limpa o campo de texto após enviar
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-auto">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Comente ou digite '/' para acionar comandos e ações da IA"
        className="h-20 w-full resize-none rounded-lg border p-3 outline-none focus:ring-2 focus:ring-purple-500"
      />
      <div className="mt-2 flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
        >
          Enviar
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
