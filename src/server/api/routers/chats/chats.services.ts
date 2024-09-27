import { chatMembers, chats } from "~/server/db/schema";
import { PublicTRPCContext } from "../../trpc";
import { TCreateChatInput } from "./chats.input";
import { TRPCError } from "@trpc/server";

export async function createChat(
  ctx: PublicTRPCContext,
  input: TCreateChatInput,
) {
  const { chat, members } = input;

  const insertChatResponse = await ctx.db
    .insert(chats)
    .values({ ...chat })
    .returning({ insertedId: chats.id });
  const insertedChatId = insertChatResponse[0]?.insertedId;

  if (!insertedChatId)
    throw new TRPCError({
      message: "Oops, houve um erro ao criar chat.",
      code: "INTERNAL_SERVER_ERROR",
    });

  await ctx.db
    .insert(chatMembers)
    .values(members.map((x) => ({ ...x, chatId: insertedChatId })));

  return { message: "Chat criado com sucesso !" };
}
