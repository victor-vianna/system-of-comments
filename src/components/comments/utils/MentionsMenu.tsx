"use client";
import { AvatarFallback } from "@radix-ui/react-avatar";
import React from "react";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { formatWithoutDiacritics } from "~/lib/formatting";
import { TListUsers } from "~/types/users";

type MentionsMenuProps = {
  users: TListUsers;
  content: string;
  handleMention: (userName: string, userId: string) => void; // Função para tratar menção
};

function MentionsMenu({ users, content, handleMention }: MentionsMenuProps) {
  const inputValue = content;
  const cursorPosition = content.length;

  // Expressão regular para capturar a menção
  const mentionRegex = /@(\w*)$/;
  const mentionRegexResult = mentionRegex.exec(
    inputValue.slice(0, cursorPosition),
  );

  const mentionMatch = mentionRegexResult?.[1];

  if (!!mentionMatch)
    return (
      <div className="flex w-full items-center gap-2">
        {users
          .filter((u) =>
            formatWithoutDiacritics(u.name, true).includes(
              formatWithoutDiacritics(mentionMatch, true),
            ),
          )
          .map((user) => (
            <div
              key={user.id}
              className="flex cursor-pointer items-center gap-1 rounded p-2 ease-in-out hover:bg-cyan-50"
              onClick={() => handleMention(user.name, user.id)} // Passa o nome e o ID do usuário
            >
              <Avatar className="h-5 w-5">
                <AvatarImage src={user.avatar ?? undefined} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <p className="text-xs leading-none tracking-tight">{user.name}</p>
            </div>
          ))}
      </div>
    );
  return null;
  // console.log("OPA");
  // return (
  //   <Popover open={true}>
  //     <PopoverContent className="flex w-80 flex-col gap-2">
  //       <h1 className="text-xs tracking-tight text-gray-500">
  //         Menções de Usuários
  //       </h1>
  //       <div className="flex w-full flex-col gap-2">
  //         {users.map((user) => (
  //           <div
  //             key={user.id}
  //             className="flex w-full cursor-pointer items-center gap-1 rounded p-2 ease-in-out hover:bg-cyan-50"
  //             onClick={() => handleMention(user.name, user.id)} // Passa o nome e o ID do usuário
  //           >
  //             <Avatar className="h-5 w-5">
  //               <AvatarImage src={user.avatar ?? undefined} />
  //               <AvatarFallback>U</AvatarFallback>
  //             </Avatar>
  //             <p className="text-xs leading-none tracking-tight">{user.name}</p>
  //           </div>
  //         ))}
  //       </div>
  //     </PopoverContent>
  //   </Popover>
  // );
}

export default MentionsMenu;
