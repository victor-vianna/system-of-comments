import { text, varchar } from "drizzle-orm/pg-core";
import { createTable } from "./common";

export const tests = createTable("tests", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  message: text("message").notNull(),
});
