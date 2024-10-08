import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "~/server/api/root";

export type TChatComments = inferProcedureOutput<
  AppRouter["comments"]["getCommentsByChat"]
>;
export type TChatComment = TChatComments[number];
