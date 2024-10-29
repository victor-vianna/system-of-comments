import { useState } from "react";
import { api } from "~/trpc/react";
import { TCreateCommentInput } from "~/types/comments";
import MentionsMenu from "./comments/utils/MentionsMenu";
import { AtSign } from "lucide-react";
import { formatContentWithoutMentionMarker } from "~/lib/mentions";
import MentionsInput, { Mention } from "./comments/utils/MentionsInput";

const ChatInput = ({ chatId, userId }: { chatId: string; userId: string }) => {
  const utils = api.useUtils();
  const { data: users } = api.users.listUsers.useQuery({ page: 1, limit: 100 });
  const [mentionsMenuIsOpen, setMentionsMenuIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState(""); // Texto para busca de menção
  // const [cursorPosition, setCursorPosition] = useState<number>(0); // Posição do cursor
  const [infoHolder, setInfoHolder] = useState<TCreateCommentInput>({
    comment: {
      chatId: chatId,
      content: "",
      authorId: userId,
    },
  });
  const [mentions, setMentions] = useState<Mention[]>([]);
  const { mutate } = api.comments.createComment.useMutation({
    onMutate: async () => {
      await utils.comments.getCommentsByChat.cancel();
    },
    onSettled: async () => {
      await utils.comments.getCommentsByChat.invalidate({ chatId });
    },
  });

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
    });
    setMentionsMenuIsOpen(false); // Fecha o menu ao enviar
  };

  // const handleMention = (userName: string, userId: string) => {
  //   const mentionText = `@${userName} `; // Cria o texto da menção

  //   // Obtenha o texto atual e a posição do cursor
  //   const inputValue = infoHolder.comment.content;

  //   // Obtenha a parte antes e depois do cursor
  //   const beforeCursor = inputValue.slice(0, cursorPosition);
  //   const afterCursor = inputValue.slice(cursorPosition);

  //   // Regex para encontrar a última menção
  //   const mentionRegex = /@\w+(?:\s\w+)?$/;
  //   const updatedBeforeCursor = beforeCursor.replace(mentionRegex, mentionText); // Substitui a última menção

  //   // Combine o novo texto
  //   const newText = `${updatedBeforeCursor}${afterCursor}`; // Atualiza o texto com a menção

  //   // Atualiza o estado com o novo texto e adiciona a menção
  //   setInfoHolder((prev) => ({
  //     ...prev,
  //     comment: { ...prev.comment, content: newText },
  //     mentions: [...prev.mentions, { chatId, userId }], // Adiciona a nova menção
  //   }));

  //   setMentionsMenuIsOpen(false); // Fecha o menu de menção após a seleção
  //   setCursorPosition(updatedBeforeCursor.length); // Atualiza a posição do cursor
  // };

  // const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   const inputValue = e.target.value;
  //   // const newCursorPosition = e.target.selectionStart; // Use uma nova variável para a posição do cursor
  //   // setCursorPosition(newCursorPosition); // Atualiza a posição do cursor

  //   setInfoHolder((prev) => ({
  //     ...prev,
  //     comment: { ...prev.comment, content: inputValue },
  //   }));

  //   // Expressão regular para capturar a menção (atualizada para capturar @Nome Sobrenome)
  //   // const mentionRegex = /@(\w+(?:\s\w+)?)/g;
  //   // const mentionMatch = mentionRegex.exec(
  //   //   inputValue.slice(0, newCursorPosition),
  //   // );

  //   // Verifica se há correspondência e define a query
  //   //   if (mentionMatch?.[1]) {
  //   //     setQuery(mentionMatch[1]); // Define a query para buscar usuários
  //   //     setMentionsMenuIsOpen(true); // Abre o menu de menções
  //   //   } else {
  //   //     setMentionsMenuIsOpen(false); // Fecha o menu se não houver menção
  //   //   }
  //   // };

  //   // const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  //   //   if (e.key === "Backspace") {
  //   //     const mentionRegex = /@\w+(?:\s\w+)?/g; // Corrigido o Regex
  //   //     const beforeCursor = infoHolder.comment.content.slice(0, cursorPosition);
  //   //     const mentionMatch = Array.from(
  //   //       beforeCursor.matchAll(mentionRegex),
  //   //     ).pop();

  //   //     const mentionStart = mentionMatch?.index;
  //   //     const mentionEnd =
  //   //       mentionMatch && mentionStart !== undefined
  //   //         ? mentionStart + mentionMatch[0].length
  //   //         : 0;

  //   //     if (
  //   //       mentionStart !== undefined &&
  //   //       cursorPosition > mentionStart &&
  //   //       cursorPosition <= mentionEnd
  //   //     ) {
  //   //       e.preventDefault();

  //   //       const newContent =
  //   //         infoHolder.comment.content.slice(0, mentionStart) +
  //   //         infoHolder.comment.content.slice(mentionEnd);

  //   //       setInfoHolder((prev) => ({
  //   //         ...prev,
  //   //         comment: { ...prev.comment, content: newContent },
  //   //         mentions: prev.mentions.filter((mention) => {
  //   //           if (mentionMatch && mentionMatch.length > 0) {
  //   //             return (
  //   //               users?.find((user) => user.id === mention.userId)?.name !==
  //   //               mentionMatch[0].slice(1) // Remove do estado de 'mentions'
  //   //             );
  //   //           }
  //   //           return true;
  //   //         }),
  //   //       }));
  //   //       setCursorPosition(mentionStart); // Atualiza a posição do cursor
  //   //     }
  //   //   }
  //   // };
  // };
  return (
    <form onSubmit={handleSubmit} className="mt-auto">
      <MentionsInput
        suggestions={users?.map((u) => u.name) ?? []}
        value={infoHolder.comment.content}
        onChange={(e) =>
          setInfoHolder((prev) => ({
            ...prev,
            comment: { ...prev.comment, content: e },
          }))
        }
        mentions={mentions}
        onMentionsChange={(m) => setMentions(m)}
      />
      {/* <textarea
        value={infoHolder.comment.content}
        onChange={handleTextChange}
        // onKeyDown={handleKeyDown}
        placeholder="Comente ou digite '@' para mencionar alguém"
        className="relative z-10 h-20 w-full resize-none rounded-lg border bg-transparent p-3 text-black outline-none focus:ring-2 focus:ring-purple-500"
        style={{ caretColor: "black" }}
      />

      Menu de menções é exibido quando necessário
      <MentionsMenu
        users={users ?? []}
        content={infoHolder.comment.content}
        handleMention={(userName: string) => {
          setInfoHolder((prev) => ({
            ...prev,
            comment: {
              ...prev.comment,
              content: `${prev.comment.content}@${userName}`,
            },
          }));
        }}
      /> */}

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
