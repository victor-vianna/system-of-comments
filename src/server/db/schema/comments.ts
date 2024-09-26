// src/server/db/schema/comments.ts

import { pgTable, serial, text, integer, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { posts } from "./posts"; // Referencia à tabela de posts

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id), // Relaciona com a tabela de posts
  content: text("content").notNull(),
  author: text("author").notNull(),
  likes: integer("likes").default(0),
  parentId: integer("parent_id").references(() => comments.id), // Auto-referência para comentários de resposta
  createdAt: timestamp("created_at").defaultNow(),
});
