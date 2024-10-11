import { publicProcedure } from "../../trpc";
import { listUsersInput, searchUserByNameInput } from "./users.input";
import * as userService from "./users.input";

export const searchUserByNameProcedure = publicProcedure
  .input(searchUserByNameInput)
  .query(async ({ input }) => {
    return await userService.searchUserByName(input.query);
  });

export const listUsersProcedure = publicProcedure
  .input(listUsersInput)
  .query(async ({ input }) => {
    return await userService.listUsers(input.limit, input.page);
  });

export const usersRouter = router({
  searchUserByName: searchUserByNameProcedure,
  listUsers: listUsersProcedure,
});
