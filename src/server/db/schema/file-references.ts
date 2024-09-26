import { integer, timestamp, varchar } from "drizzle-orm/pg-core";
import { createTable } from "./common";
import { comments } from "./comments";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const fileReferences = createTable("file_references", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  commentId: varchar("comment_id", { length: 255 }).references(
    () => comments.id,
  ),
  title: varchar("title", { length: 255 }).notNull(),
  format: varchar("format", { length: 255 }).notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  size: integer("size").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  authorId: varchar("author_id", { length: 255 })
    .references(() => users.id)
    .notNull(),
});

export const fileReferencesRelations = relations(fileReferences, ({ one }) => ({
  comment: one(comments, {
    fields: [fileReferences.commentId],
    references: [comments.id],
  }),
}));
