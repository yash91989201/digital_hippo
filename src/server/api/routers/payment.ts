import { eq } from "drizzle-orm";
// SCHEMAS
import { productTable } from "@/server/db/schema";
import { CreateSessionInput } from "@/lib/schema";
// TYPES
import { TRPCError } from "@trpc/server";
import type { ProductType } from "@/lib/schema";
// UTILS
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const paymentRouter = createTRPCRouter({
  createSession: protectedProcedure
    .input(CreateSessionInput)
    .mutation(async ({ ctx, input }) => {
      const { productIds } = input;

      if (productIds.length !== 0) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const products = await Promise.all(
        productIds.map(async (productId) => {
          const product = await ctx.db.query.productTable.findFirst({
            where: eq(productTable.id, productId),
          });
          return product;
        }),
      );

      const validProducts = products.filter(
        (product) => product !== undefined,
      ) as ProductType[];
    }),
});
