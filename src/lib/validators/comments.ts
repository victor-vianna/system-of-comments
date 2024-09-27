import { z } from "zod";

export const commentSchema = z.object({
  id: z.string(),
  chatId: z.string(),
  content: z.string(),
  authorId: z.string(),
  createdAt: z.string().datetime(),
});

export const commentMentionSchema = z.object({
  id: z.string(),
  chatId: z.string(),
  userId: z.string(),
  commentId: z.string(),
  createdAt: z.string().datetime(),
});

export const commentReactionSchema = z.object({
  id: z.string(),
  commentId: z.string(),
  userId: z.string(),
  reactionType: z.string(),
  createdAt: z.string(),
});

export type CommentSchema = z.infer<typeof commentSchema>;
export type CommentMentionSchema = z.infer<typeof commentMentionSchema>;
export type CommentReactionSchema = z.infer<typeof commentReactionSchema>;
