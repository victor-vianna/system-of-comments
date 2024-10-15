import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { chatRouter } from "./routers/chats/chats.procedure";
import { commentRouter } from "./routers/comments/comments.procedure";
import { fileReferencesRouter } from "./routers/file-references/file-references.procedure";
import { interactionsRouter } from "./routers/interactions/interactions.procedure";
import { usersRouter } from "./routers/users/users.procedure";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  chats: chatRouter,
  comments: commentRouter,
  reactions: interactionsRouter,
  fileReferences: fileReferencesRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
