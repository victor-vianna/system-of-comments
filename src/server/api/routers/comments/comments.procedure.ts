import { pusherServer } from "~/lib/pusher";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { createCommentInput, getCommentsByChatInput } from "./comments.input";
import { createComment, getCommentsByChat } from "./comments.services";

export const commentRouter = createTRPCRouter({
  createComment: publicProcedure
    .input(createCommentInput)
    .mutation(async ({ ctx, input }) => {
      const response = await createComment(ctx, input);
      // emitir o evento de novo comentário
      await pusherServer.trigger(`chat-${input.chatId}`, "new-comment", {
        newComment: response.data,
      });
      return response;
    }),
  getCommentsByChat: publicProcedure
    .input(getCommentsByChatInput)
    .query(async ({ ctx, input }) => getCommentsByChat(ctx, input)),
});
