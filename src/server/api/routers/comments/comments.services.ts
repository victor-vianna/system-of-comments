import {
  comments,
  commentsMentions,
  commentsReactions,
  TNewCommentMention,
} from "~/server/db/schema";
import { PublicTRPCContext } from "../../trpc";
import { TCreateCommentInput, TGetCommentsByChatInput } from "./comments.input";
import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { formatWithoutDiacritics } from "../../../../lib/formatting";
// função para criar um comentário
export async function createComment(
  ctx: PublicTRPCContext,
  input: TCreateCommentInput,
) {
  const { comment } = input;

  const chatId = comment.chatId;
  // insere o comentário no banco de dados
  const insertCommentResponse = await ctx.db
    .insert(comments)
    .values({ ...comment })
    .returning({ id: comments.id });

  const insertedCommentId = insertCommentResponse[0]?.id;
  if (!insertedCommentId)
    throw new TRPCError({
      message: "Erro ao criar comentário.",
      code: "INTERNAL_SERVER_ERROR",
    });

  const chatMembers = await ctx.db.query.chatMembers.findMany({
    where: (fields, { eq }) => eq(fields.chatId, chatId),
    with: {
      user: true,
    },
  });

  // Identifying all mentions for the comment
  const contentFormatted = formatWithoutDiacritics(comment.content, false);
  console.log(contentFormatted);
  const mentionRegex = /@(\w+(?:\s\w+)?)/g;
  const mentionedUsernames = Array.from(
    contentFormatted.matchAll(mentionRegex),
    (m) => m[1],
  ).filter((m) => !!m) as string[];

  console.log("USUÁRIOS MENCIONADOS", mentionedUsernames);
  const mentionsToInsert: TNewCommentMention[] = mentionedUsernames
    .map((mentionU) => {
      if (!mentionU) return null;
      const equivalentUser = chatMembers.find((chatMember) => {
        const chatMemberFormatted = formatWithoutDiacritics(
          chatMember.user.name,
          false,
        );
        const mentionUsernameFormatted = formatWithoutDiacritics(
          mentionU,
          false,
        );

        return chatMemberFormatted == mentionUsernameFormatted;
      });
      if (!equivalentUser) return null;
      return {
        chatId: chatId,
        userId: equivalentUser.userId,
        commentId: insertedCommentId,
      };
    })
    .filter((m) => !!m);

  let mentionsInsertResponse: {
    chatId: string;
    createdAt: Date;
    id: string;
    userId: string;
    commentId: string;
  }[] = [];
  if (mentionsToInsert.length > 0)
    mentionsInsertResponse = await ctx.db
      .insert(commentsMentions)
      .values(mentionsToInsert)
      .returning({
        id: commentsMentions.id,
        chatId: commentsMentions.chatId,
        userId: commentsMentions.userId,
        commentId: commentsMentions.commentId,
        createdAt: commentsMentions.createdAt,
      });

  return {
    data: {
      ...input,
      comment: { ...input.comment, id: insertedCommentId },
      mentions: mentionsInsertResponse,
    },
    message: "Comentário criado com sucesso!",
  };
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

// export async function identifyMentions(content: string, ctx: PublicTRPCContext) {
//   const mentionRegex = /@(\w+(?:\s\w+)?)/g;
//   const mentionedUsernames = Array.from(content.matchAll(mentionRegex), m => m[1]);

//   if (mentionedUsernames.length === 0) {
//     return [];
//   }

//   const mentionedUsers = [];
//   for (const username of mentionedUsernames) {
//     const user = await ctx.db.query.users.findFirst({

//     })
//   }
//     columns: {
//       id: true
//       name: true,
//     },
//   });

//   return mentionedUsers.map(user => ({
//     userId: user.id,
//     name: user.name,
//   }));
// }
