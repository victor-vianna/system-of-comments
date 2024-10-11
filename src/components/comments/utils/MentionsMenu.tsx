import { AvatarFallback } from "@radix-ui/react-avatar";
import React, { PropsWithChildren } from "react";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

type MentionsMenuProps = {
  handleMention: (userId: string) => void;
};
function MentionsMenu({
  children,
  handleMention,
}: PropsWithChildren<MentionsMenuProps>) {
  const users = [{ id: "1", name: "Victor Vianna", avatar: null }];
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="flex w-80 flex-col gap-2">
        <h1 className="text-xs tracking-tight text-gray-500">
          Menu de Menções de Usuários
        </h1>
        <div className="flex w-full flex-col gap-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex w-full cursor-pointer items-center gap-1 rounded p-2 ease-in-out hover:bg-cyan-50"
            >
              <Avatar className="h-5 w-5">
                <AvatarImage src={user.avatar ?? undefined} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <p className="text-xs leading-none tracking-tight">{user.name}</p>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default MentionsMenu;
