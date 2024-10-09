import { z } from "zod";
import { commentReactionSchema } from "~/lib/validators/comments";

// validação das curtidas
export const likeCommentInput = z.object({
  commentId: z.string(),
  userId: z.string(),
});

// validação das reações
export const reactToCommentInput = z.object({
  commentId: z.string(),
  emoji: z.string(),
  userId: z.string(),
});

export const CreateReactionInput = commentReactionSchema;
export type TCreateReactionInput = z.infer<typeof CreateReactionInput>;
