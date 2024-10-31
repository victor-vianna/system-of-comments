import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "~/server/api/root";

export type TChatById = inferProcedureOutput<AppRouter["chats"]["getChatById"]>;
