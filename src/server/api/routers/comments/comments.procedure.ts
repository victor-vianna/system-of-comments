import { pusherServer } from "~/lib/pusher";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { createCommentInput, getCommentsByChatInput } from "./comments.input";
import { createComment, getCommentsByChat } from "./comments.services";

export const commentRouter = createTRPCRouter({
  createComment: publicProcedure
    .input(createCommentInput)
    .mutation(async ({ ctx, input }) => {
      await createComment(ctx, input);
      await pusherServer.trigger("1", "new-comment", input);
    }),
  getCommentsByChat: publicProcedure
    .input(getCommentsByChatInput)
    .query(async ({ ctx, input }) => getCommentsByChat(ctx, input)),
});
