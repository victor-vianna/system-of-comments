/**
 * REACTIONS
 */

import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "~/server/api/root";

export type TCreateReactionOutput = inferProcedureOutput<
  AppRouter["reactions"]["createReaction"]
>;
export type TDeleteReactionOutput = inferProcedureOutput<
  AppRouter["reactions"]["deleteReaction"]
>;
