import { text, varchar } from "drizzle-orm/pg-core";
import { createTable } from "./common";

export const users = createTable("users", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  avatar: text("avatar"),
  name: text("name").notNull(),
  email: text("email"),
});
