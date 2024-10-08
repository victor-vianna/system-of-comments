import { chatMembers, chats } from "~/server/db/schema";
import type { TCreateChatInput } from "./chats.input";
import { TRPCError } from "@trpc/server";
import type { PublicTRPCContext } from "../../trpc";

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

export async function getChatById(ctx: PublicTRPCContext, input: string) {
  const chat = await ctx.db.query.chats.findFirst({
    where: (fields, { eq }) => eq(fields.id, input),
    with: {
      author: {
        columns: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      members: {
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
  });
  if (!chat)
    throw new TRPCError({ message: "Chat não encontrado.", code: "NOT_FOUND" });

  return chat;
}
