import { comments } from "~/server/db/schema";
import { PublicTRPCContext } from "../../trpc";
import { TCreateCommentInput, TGetCommentsByChatInput } from "./comments.input";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";

// função para criar um comentário
export async function createComment(
  ctx: PublicTRPCContext,
  input: TCreateCommentInput,
) {
  const { chatId, content, authorId } = input;

  // insere o comentário no banco de dados
  const insertCommentResponse = await ctx.db
    .insert(comments)
    .values({ chatId, content, authorId })
    .returning({ id: comments.id });

  const insertedCommentId = insertCommentResponse[0]?.id;

  if (!insertedCommentId)
    throw new TRPCError({
      message: "Erro ao criar comentário.",
      code: "INTERNAL_SERVER_ERROR",
    });

  return { message: "Comentário criado com sucesso!" };
}

// função para buscar comentário por chat
export async function getCommentsByChat(
  ctx: PublicTRPCContext,
  input: TGetCommentsByChatInput,
) {
  const { chatId } = input;

  // consulta os comentários associados ao chatId
  const chatComments = await ctx.db.query.comments.findMany({
    where: (fields, { eq }) => eq(fields.chatId, chatId),
    with: {
      attachments: {
        columns: {
          id: true,
          format: true,
          title: true,
          url: true,
        },
      },
      reactions: {
        columns: {
          id: true,
          reactionType: true,
          userId: true,
        },
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
      mentions: {
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
      author: {
        columns: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy(fields, operators) {
      return operators.asc(fields.createdAt);
    },
  });

  return chatComments;
}
