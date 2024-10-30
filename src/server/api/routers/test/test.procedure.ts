import { tests } from "~/server/db/schema";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { CreateMesssageInputSchema } from "./test.input";
import { pusherServer } from "~/lib/pusher";

export const testRouter = createTRPCRouter({
  createMessage: publicProcedure
    .input(CreateMesssageInputSchema)
    .mutation(async ({ ctx, input }) => {
      await pusherServer.trigger("1", "new-message", input);

      await ctx.db.insert(tests).values(input);

      return "Mensagem criada com sucesso !";
    }),
  getMessages: publicProcedure.query(async ({ ctx }) => {
    const messages = await ctx.db.query.tests.findMany();
    return messages;
  }),
});
