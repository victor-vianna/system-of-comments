import { text, timestamp, varchar } from "drizzle-orm/pg-core";
import { chats } from "./chats";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { createTable } from "./common";
import { fileReferences } from "./file-references";

export const comments = createTable("comments", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  chatId: varchar("chat_id")
    .references(() => chats.id)
    .notNull(),
  content: text("content").notNull(),
  authorId: varchar("author_id", { length: 255 })
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const commentsRelations = relations(comments, ({ one, many }) => ({
  chat: one(chats, {
    fields: [comments.chatId],
    references: [chats.id],
  }),
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
  attachments: many(fileReferences),
}));

export const commentsMentions = createTable("comment_mentions", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  chatId: varchar("chat_id")
    .references(() => chats.id)
    .notNull(),
  userId: varchar("user_id")
    .references(() => users.id)
    .notNull(),
  commentId: varchar("comment_id")
    .references(() => comments.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const commentsfiles = createTable("comment_files", {});

export const commentsreactions = createTable("comment_reactions", {});
