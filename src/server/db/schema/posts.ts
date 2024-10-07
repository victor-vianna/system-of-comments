import { timestamp, varchar } from "drizzle-orm/pg-core";
import { createTable } from "./common";


export const posts = createTable("posts", {
    id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  });
  