import { z } from "zod"


// valida o input para criar um comentário
export const createCommentInput = z.object({
    chatId: z.string(),
    content: z.string(),
    authorId: z.string(),
});

// valida o input para buscar comentário post 
export const getCommentsByChatInput = z.object({
    chatId: z.string(),
});

export type TCreateCommentInput = z.infer<typeof createCommentInput>;
export type TGetCommentsByChatInput = z.infer<typeof getCommentsByChatInput>;
