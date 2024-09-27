import { z } from "zod";

export const fileReferenceShema = z.object({
  id: z.string(),
  commentId: z.string(),
  title: z.string(),
  format: z.string(),
  url: z.string(),
  size: z.number(),
  createdAt: z.string().datetime(),
  authorId: z.string(),
});

export type FileReferences = z.infer<typeof fileReferenceShema>;
