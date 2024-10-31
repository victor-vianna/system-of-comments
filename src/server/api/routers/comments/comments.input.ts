import { z } from "zod";
import {
  commentMentionSchema,
  commentReactionSchema,
  commentSchema,
} from "~/lib/validators/comments";

// valida o input para criar um comentário
export const createCommentInput = z.object({
  chatId: z.string(),
  comment: commentSchema,
});

// valida o input para buscar comentário post
export const getCommentsByChatInput = z.object({
  chatId: z.string(),
});

export type TCreateCommentInput = z.infer<typeof createCommentInput>;
export type TGetCommentsByChatInput = z.infer<typeof getCommentsByChatInput>;
