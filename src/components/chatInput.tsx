// src/components/ChatInput.tsx
"use client";

import { AtSign } from "lucide-react";
import { useState } from "react";
import { api } from "~/trpc/react";
import { TCreateCommentInput } from "~/types/comments";
import MentionsMenu from "./comments/utils/MentionsMenu";

const ChatInput = ({ chatId, userId }: { chatId: string; userId: string }) => {
  const [mentionsMenuIsOpen, setMentionsMenuIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
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

    mutate(infoHolder);

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
  const handleMention = (userId: string, userId: string) => {
    const beforeCursor = infoHolder.comment.content
      .slice(0, cursorPosition)
      .replace(/@\w*$/, `@${userName} `);
    const afterCursor = infoHolder.comment.content.slice(cursorPosition);
    const newText = `${beforeCursor}${afterCursor}`;

    setInfoHolder((prev) => ({
      ...prev,
      comment: { ...prev.comment, content: newText },
      mentions: [...prev.mentions, { chatId, userId }],
    }));

    setMentionsMenuIsOpen(false);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const inputValue = e.target.value;
      const cursorPosition = e.target.selectionStart;
      setCursorPosition(cursorPosition);

      setInfoHolder((prev) => ({
        ...prev,
        comment: { ...prev.comment, content: inputValue },
      }));

      // Verifica se o usuário começou a digitar uma menção com "@"
      const mentionMatch = inputValue.slice(0, cursorPosition).match(/@(\w*)$/);
      if (mentionMatch) {
        const searchQuery = mentionMatch[1];
        setQuery(searchQuery); // Define o texto a ser buscado
        setMentionsMenuIsOpen(true); // Abre o menu de menções
      } else {
        setMentionsMenuIsOpen(false); // Fecha o menu se não houver menção
      }
    };
  };
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
