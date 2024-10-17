import { useState } from "react";
import { api } from "~/trpc/react";
import { TCreateCommentInput } from "~/types/comments";
import MentionsMenu from "./comments/utils/MentionsMenu";
import { AtSign } from "lucide-react";

const ChatInput = ({ chatId, userId }: { chatId: string; userId: string }) => {
  const { data: users } = api.users.listUsers.useQuery({ page: 1, limit: 100 });
  const [mentionsMenuIsOpen, setMentionsMenuIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState(""); // Texto para busca de menção
  const [cursorPosition, setCursorPosition] = useState(0); // Posição do cursor
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
    if (infoHolder.comment.content.trim() === "") return; // Não permite envio de comentário vazio

    mutate(infoHolder);

    // Limpa o campo de texto após o envio
    setInfoHolder({
      comment: {
        chatId: chatId,
        content: "",
        authorId: userId,
      },
      mentions: [],
      reactions: [],
    });
    setMentionsMenuIsOpen(false); // Fecha o menu ao enviar
  };

  const handleMention = (userName: string, userId: string) => {
    const beforeCursor = infoHolder.comment.content
      .slice(0, cursorPosition)
      .replace(/@\w*$/, `@${userName} `); // Insere o nome do usuário mencionado
    const afterCursor = infoHolder.comment.content.slice(cursorPosition);
    const newText = `${beforeCursor}${afterCursor}`; // Atualiza o texto com a menção

    // Atualiza o estado com o novo texto e adiciona a menção
    setInfoHolder((prev) => ({
      ...prev,
      comment: { ...prev.comment, content: newText },
      mentions: [...prev.mentions, { chatId, userId }],
    }));

    setMentionsMenuIsOpen(false); // Fecha o menu de menção após a seleção
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    const cursorPosition = e.target.selectionStart;
    setCursorPosition(cursorPosition);

    setInfoHolder((prev) => ({
      ...prev,
      comment: { ...prev.comment, content: inputValue },
    }));

    // Expressão regular para capturar a menção
    const mentionRegex = /@(\w*)$/;
    const mentionMatch = mentionRegex.exec(inputValue.slice(0, cursorPosition));

    // Verifica se há correspondência e define a query
    if (mentionMatch?.[1]) {
      console.log("Menção detectada:", mentionMatch[1]);
      setQuery(mentionMatch[1]); // Define a query para buscar usuários
      setMentionsMenuIsOpen(true); // Abre o menu de menções
    } else {
      console.log("Nenhuma menção detectada");
      setMentionsMenuIsOpen(false); // Fecha o menu se não houver menção
    }
  };
  console.log(cursorPosition);
  return (
    <form onSubmit={handleSubmit} className="mt-auto">
      <textarea
        value={infoHolder.comment.content}
        onChange={handleTextChange}
        placeholder="Comente ou digite '@' para mencionar alguém"
        className="h-20 w-full resize-none rounded-lg border p-3 outline-none focus:ring-2 focus:ring-purple-500"
      />

      {/* Menu de menções é exibido quando necessário */}
      {/* {mentionsMenuIsOpen && <MentionsMenu handleMention={handleMention} />} */}
      <MentionsMenu
        users={users ?? []}
        content={infoHolder.comment.content}
        handleMention={handleMention}
      />

      <div className="mt-2 flex justify-end gap-3">
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
