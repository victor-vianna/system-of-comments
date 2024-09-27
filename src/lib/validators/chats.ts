import { z } from "zod";

export const chatSchema = z.object({
  title: z.string({
    required_error: "Título não informado.",
    invalid_type_error: "Tipo não válido para título.",
  }),
  creatAt: z.string({
    required_error: "Data de criação não informada.",
    invalid_type_error: "Tipo não válido para data de criação.",
  }),
  authorId: z.string({
    required_error: "Autor ID não informado",
    invalid_type_error: "Tipo não válido para autor ID.",
  }),
});

export const chatMembersSchema = z.object({
  chatId: z.string(),
  userId: z.string(),
});

export type ChatSchema = z.infer<typeof chatSchema>;
