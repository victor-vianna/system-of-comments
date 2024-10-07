import { fileReferences } from "~/server/db/schema";
import type { PublicTRPCContext } from "../../trpc";
import type { TCreateFileReferenceInput } from "./file-references.input";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export async function createFileReference(
  ctx: PublicTRPCContext,
  input: TCreateFileReferenceInput,
) {
  const { title, format, url, size, commentId, authorId } = input;

  // Inserir a referência de arquivo no banco de dados
  const insertFileReferenceResponse = await ctx.db
    .insert(fileReferences)
    .values({
      title,
      format,
      url,
      size,
      commentId: commentId ?? null, // Pode ser opcional
      authorId,
    })
    .returning({ insertedId: fileReferences.id });

  const insertedFileReferenceId = insertFileReferenceResponse[0]?.insertedId;

  if (!insertedFileReferenceId) {
    throw new TRPCError({
      message: "Erro ao criar referência de arquivo.",
      code: "INTERNAL_SERVER_ERROR",
    });
  }

  return {
    message: "Referência de arquivo criada com sucesso!",
    id: insertedFileReferenceId,
  };
}

export async function getFileReferenceById(ctx: PublicTRPCContext, id: string) {
  const fileReference = await ctx.db
    .select()
    .from(fileReferences)
    .where(eq(fileReferences.id, id))
    .limit(1);

  if (!fileReference[0]) {
    throw new TRPCError({
      message: "Referência de arquivo não encontrada.",
      code: "NOT_FOUND",
    });
  }

  return fileReference[0];
}
