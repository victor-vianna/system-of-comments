import { z } from "zod";
import { chatMembersSchema, chatSchema } from "~/lib/validators/chats";

export const createChatInput = z.object({
  chat: chatSchema,
  members: z.array(chatMembersSchema.omit({ chatId: true })),
});
export type TCreateChatInput = z.infer<typeof createChatInput>;
export const getChatInput = z.object({
  id: z.string(),
});
