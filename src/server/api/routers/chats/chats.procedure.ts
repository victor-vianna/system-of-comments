import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { ChatIdInputSchema, createChatInput } from "./chats.input";
import { createChat, getChatById } from "./chats.services";

export const chatRouter = createTRPCRouter({
  getChatById: publicProcedure
    .input(ChatIdInputSchema)
    .query(async ({ ctx, input }) => getChatById(ctx, input)),
  createChat: publicProcedure
    .input(createChatInput)
    .mutation(async ({ ctx, input }) => createChat(ctx, input)),
});
