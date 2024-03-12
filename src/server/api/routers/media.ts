import { eq } from "drizzle-orm";
// SCHEMAS
import { imageTable, fileTable } from "@/server/db/schema";
import { AddFileSchema, AddImageSchema } from "@/lib/schema";
// UTILS
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const mediaRouter = createTRPCRouter({
  getUserFiles: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.fileTable.findMany({
      where: eq(fileTable.userId, ctx.session.user.id),
    });
  }),

  getUserImages: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.imageTable.findMany({
      where: eq(imageTable.userId, ctx.session.user.id),
    });
  }),

  addNewFiles: protectedProcedure
    .input(AddFileSchema)
    .mutation(async ({ ctx, input }) => {
      const [insertImageQuery] = await ctx.db
        .insert(fileTable)
        .values(input.files);

      return {
        status: "SUCCESS",
        message: `${insertImageQuery.affectedRows} of ${input.files.length} images uploaded successfully`,
      };
    }),

  addNewImages: protectedProcedure
    .input(AddImageSchema)
    .mutation(async ({ ctx, input }) => {
      const [insertImageQuery] = await ctx.db
        .insert(imageTable)
        .values(input.images);

      return {
        status: "SUCCESS",
        message: `${insertImageQuery.affectedRows} /${input.images.length} images uploaded successfully`,
      };
    }),
});
