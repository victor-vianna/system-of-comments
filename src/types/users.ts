import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "~/server/api/root";

export type TListUsers = inferProcedureOutput<AppRouter["users"]["listUsers"]>;
