import { text, varchar } from "drizzle-orm/pg-core";
import { createTable } from "./common";
import { comments } from "./comments";

// tabela de curtidas
export const likes = createTable("likes", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id").notNull(),
  commentId: text("comment_id").references(() => comments.id),
});

// tabela de reações

export const reactions = createTable("reactions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  emoji: text("emoji").notNull(),
  userId: varchar("user_id").notNull(),
  commentId: text("comment_id").references(() => comments.id),
});
