import { pgTableCreator } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator(
  (name) => `system-of-comments_${name}`,
);
