import { createTRPCRouter, publicProcedure } from "../../trpc";
import {
  CreateReactionInput,
  DeleteReactionInputSchema,
  likeCommentInput,
  reactToCommentInput,
} from "./interactions.input";
import { createReaction, deleteReaction } from "./interactions.services";

export const interactionsRouter = createTRPCRouter({
  // rota para adicionar curtida a um comentário
  createReaction: publicProcedure
    .input(CreateReactionInput)
    .mutation(async ({ ctx, input }) => {
      return createReaction(ctx, input);
    }),
  deleteReaction: publicProcedure
    .input(DeleteReactionInputSchema)
    .mutation(async ({ ctx, input }) => {
      return deleteReaction(ctx, input);
    }),

  //   //rota para adicionar reação a um comentário
  //   reactToComment: publicProcedure
  //     .input(reactToCommentInput)
  //     .mutation(async (ctx, input) => {
  //       return reactToComment(ctx, input.commentId, input.emoji, input.userId);
  //     }),

  //   //rota para obter reações de um comentário
  //   getReactionsByComment: publicProcedure
  //     .input(z.number())
  //     .query(async (contextProps, input) => {
  //       return getReactionsByComment(contextProps, input);
  //     }),
});
