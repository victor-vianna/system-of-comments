import { inferProcedureInput, inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "~/server/api/root";

export type TChatComments = inferProcedureOutput<
  AppRouter["comments"]["getCommentsByChat"]
>;
export type TChatComment = TChatComments[number];

export type TCreateCommentInput = inferProcedureInput<
  AppRouter["comments"]["createComment"]
>;
