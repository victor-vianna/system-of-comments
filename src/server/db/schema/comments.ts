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
  mentions: many(commentsMentions),
  reactions: many(commentsReactions),
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
export const commentsMentionsRelations = relations(
  commentsMentions,
  ({ one, many }) => ({
    chat: one(chats, {
      fields: [commentsMentions.chatId],
      references: [chats.id],
    }),
    user: one(users, {
      fields: [commentsMentions.userId],
      references: [users.id],
    }),
    comment: one(comments, {
      fields: [commentsMentions.commentId],
      references: [comments.id],
    }),
  }),
);
export type TCommentMention = typeof commentsMentions.$inferSelect;
export type TNewCommentMention = typeof commentsMentions.$inferInsert;

// tabela de reações
export const commentsReactions = createTable("comment_reactions", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  commentId: varchar("comment_id", { length: 255 })
    .references(() => comments.id)
    .notNull(),
  chatId: varchar("chat_id")
    .references(() => chats.id)
    .notNull(),
  userId: varchar("user_id", { length: 255 })
    .references(() => users.id)
    .notNull(),
  reactionType: varchar("reaction_type", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// relações entre reações e comentários
export const commentsReactionsRelations = relations(
  commentsReactions,
  ({ one }) => ({
    comment: one(comments, {
      fields: [commentsReactions.commentId],
      references: [comments.id],
    }),
    user: one(users, {
      fields: [commentsReactions.userId],
      references: [users.id],
    }),
  }),
);
