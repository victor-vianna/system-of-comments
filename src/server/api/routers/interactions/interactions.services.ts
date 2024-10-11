import { db } from "~/server/db";
import { commentsReactions } from "~/server/db/schema";
import { PublicTRPCContext } from "../../trpc";
import { TCreateChatInput } from "../chats/chats.input";
import { TCreateReactionInput } from "./interactions.input";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

// função para adicionar curtida
export const createReaction = async (
  ctx: PublicTRPCContext,
  input: TCreateReactionInput,
) => {
  console.log(input);

  const response = await ctx.db
    .insert(commentsReactions)
    .values({ ...input })
    .returning({ insertedId: commentsReactions.id });

  const insertedId = response[0]?.insertedId;
  if (!insertedId)
    throw new TRPCError({
      message: "Oops, houve um erro ao criar reação.",
      code: "INTERNAL_SERVER_ERROR",
    });

  return "Reação criada com sucesso !";
};

export const deleteReaction = async (ctx: PublicTRPCContext, input: string) => {
  await ctx.db.delete(commentsReactions).where(eq(commentsReactions.id, input));
  return "Reação removida com sucesso !";
};

// // função para adicionar reação com emoji
// export const reactToComment = async (
//   commentId: string,
//   emoji: string,
//   userId: string,
// ) => {
//   return await db.insert(reactions).values({
//     commentId,
//     emoji,
//     userId,
//   });
// };

// função para recuperar as reações de um comentário
