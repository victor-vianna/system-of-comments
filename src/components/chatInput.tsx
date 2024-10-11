// src/components/ChatInput.tsx
"use client";

import { AtSign } from "lucide-react";
import { useState } from "react";
import { api } from "~/trpc/react";
import { TCreateCommentInput } from "~/types/comments";
import MentionsMenu from "./comments/utils/MentionsMenu";

const ChatInput = ({ chatId, userId }: { chatId: string; userId: string }) => {
  const [mentionsMenuIsOpen, setMentionsMenuIsOpen] = useState<boolean>(false);
  const [infoHolder, setInfoHolder] = useState<TCreateCommentInput>({
    comment: {
      chatId: chatId,
      content: "",
      authorId: userId,
    },
    mentions: [],
    reactions: [],
  });
  const { mutate } = api.comments.createComment.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Verifica se o comentário não está vazio antes de enviar
    if (infoHolder.comment.content.trim() === "") return;

    // Envia o comentário usando a mutação do TRPC
    // mutate({
    //   content: comment,
    //   chatId: chatId,
    //   authorId: userId, // Alterar para o ID real do usuário
    // });

    // Limpa o campo de texto após enviar
    setInfoHolder({
      comment: {
        chatId: chatId,
        content: "",
        authorId: userId,
      },
      mentions: [],
      reactions: [],
    });
  };
  function handleMention(userId: string) {
    setInfoHolder((prev) => ({
      ...prev,
      mentions: [...prev.mentions, { chatId, userId }],
    }));
  }
  return (
    <form onSubmit={handleSubmit} className="mt-auto">
      <textarea
        value={infoHolder.comment.content}
        onChange={(e) =>
          setInfoHolder((prev) => ({
            ...prev,
            comment: { ...prev.comment, content: e.target.value },
          }))
        }
        placeholder="Comente ou digite '/' para acionar comandos e ações da IA"
        className="h-20 w-full resize-none rounded-lg border p-3 outline-none focus:ring-2 focus:ring-purple-500"
      />
      <div className="mt-2 flex justify-end gap-3">
        <MentionsMenu handleMention={handleMention}>
          <button>
            <AtSign width={18} height={18} />
          </button>
        </MentionsMenu>

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
