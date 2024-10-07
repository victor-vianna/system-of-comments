import { createTRPCRouter, publicProcedure } from "../../trpc";
import { createCommentInput, getCommentsByChatInput } from "./comments.input";
import { createComment, getCommentsByChat } from "./comments.services";

export const commentRouter = createTRPCRouter({
  createComment: publicProcedure
    .input(createCommentInput)
    .mutation(async ({ ctx, input }) => createComment(ctx, input)),

  getCommentsByChatInput: publicProcedure
    .input(getCommentsByChatInput)
    .query(async ({ ctx, input }) => getCommentsByChat(ctx, input)),
});
