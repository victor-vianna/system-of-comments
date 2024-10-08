import { text, varchar } from "drizzle-orm/pg-core";
import { createTable } from "./common";
import { relations } from "drizzle-orm";
import { chats } from "./chats";

export const users = createTable("users", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  avatar: text("avatar"),
  name: text("name").notNull(),
  email: text("email"),
});

export const userRelations = relations(users, ({ many }) => ({
  chats: many(chats),
}));
