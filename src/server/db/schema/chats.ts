import { relations } from "drizzle-orm";
import { text, timestamp, varchar } from "drizzle-orm/pg-core";
import { comments } from "./comments";
import { createTable } from "./common";
import { users } from "./users";

export const chats = createTable("chats", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  authorId: varchar("author_id", { length: 255 }).notNull(),
});
export const chatRelations = relations(chats, ({ one, many }) => ({
  membros: many(chatMembers),
  comments: many(comments),
}));

export const chatMembers = createTable("chat-members", {
  chatId: varchar("chat_id")
    .references(() => chats.id)
    .notNull(),
  userId: varchar("user_id")
    .references(() => users.id)
    .notNull(),
});
export const chatMembersRelations = relations(chatMembers, ({ one, many }) => ({
  chat: one(chats, {
    fields: [chatMembers.chatId],
    references: [chats.id],
  }),
  user: one(users, {
    fields: [chatMembers.userId],
    references: [users.id],
  }),
}));
