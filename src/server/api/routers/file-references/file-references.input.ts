import { z } from "zod";

export const createFileReferenceInput = z.object({
  commentId: z.string().optional(),
  title: z.string().min(1),
  format: z.string().min(1),
  url: z.string().url(),
  size: z.number().positive(),
  authorId: z.string().min(1),
});
export type TCreateFileReferenceInput = z.infer<
  typeof createFileReferenceInput
>;

export const getFileReferenceInput = z.object({
  id: z.string(),
});
export type TGetFileReferenceInput = z.infer<typeof getFileReferenceInput>;
