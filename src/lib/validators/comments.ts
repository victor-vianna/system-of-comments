import { z } from "zod";

export const commentSchema = z.object({
  chatId: z.string(),
  content: z.string(),
  authorId: z.string(),
  createdAt: z.date().optional(),
});

export const commentMentionSchema = z.object({
  chatId: z.string(),
  userId: z.string(),
  commentId: z.string(),
  createdAt: z.date().optional(),
});

export const commentReactionSchema = z.object({
  commentId: z.string(),
  chatId: z.string(),
  userId: z.string(),
  reactionType: z.string(),
  createdAt: z.date().optional(),
});

export type CommentSchema = z.infer<typeof commentSchema>;
export type CommentMentionSchema = z.infer<typeof commentMentionSchema>;
export type CommentReactionSchema = z.infer<typeof commentReactionSchema>;
