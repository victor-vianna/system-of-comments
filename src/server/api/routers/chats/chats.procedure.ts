import { createTRPCRouter, publicProcedure } from "../../trpc";
import { createChatInput } from "./chats.input";
import { createChat } from "./chats.services";

export const chatRouter = createTRPCRouter({
  createChat: publicProcedure
    .input(createChatInput)
    .mutation(async ({ ctx, input }) => createChat(ctx, input)),
});
