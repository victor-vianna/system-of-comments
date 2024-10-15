import { like } from "drizzle-orm";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

export const searchUserByName = async (query: string) => {
  return await db
    .select()
    .from(users)
    .where(like(users.name, `%${query}`)) //filtro por nome contendo a query
    .limit(10);
};

//listar usuários com paginação
export const listUsers = async (limit: number, page: number) => {
  const MaxPageSize = 100;

  const PAGE_SIZE = limit > 100 ? MaxPageSize : limit;

  const offset = PAGE_SIZE * (page - 1);

  return await db.select().from(users).limit(PAGE_SIZE).offset(offset);
};
