// UTILS
import { createTRPCRouter } from "@/server/api/trpc";
import { mediaRouter } from "@/server/api/routers/media";
import { paymentRouter } from "@/server/api/routers/payment";
import { productRouter } from "@/server/api/routers/product";

/**
 * This is the primary router for your server.
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  media: mediaRouter,
  product: productRouter,
  payment: paymentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
