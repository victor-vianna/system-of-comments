import { z } from "zod";

export const searchUserByNameInput = z.object({
  query: z.string(),
});
export const listUsersInput = z.object({
  limit: z.number(),
  page: z.number(),
});

export type TSearchUserByNameInput = z.infer<typeof searchUserByNameInput>;
export type TListUsersInput = z.infer<typeof listUsersInput>;
