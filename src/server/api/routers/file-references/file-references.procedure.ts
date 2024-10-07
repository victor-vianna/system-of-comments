import { createTRPCRouter, publicProcedure } from "../../trpc";
import {
  createFileReferenceInput,
  getFileReferenceInput,
} from "./file-references.input";
import {
  createFileReference,
  getFileReferenceById,
} from "./file-references.services";

export const fileReferencesRouter = createTRPCRouter({
  createFileReference: publicProcedure
    .input(createFileReferenceInput)
    .mutation(async ({ ctx, input }) => createFileReference(ctx, input)),

  getFileReference: publicProcedure
    .input(getFileReferenceInput)
    .query(async ({ ctx, input }) => getFileReferenceById(ctx, input.id)),
});
