import { generateId } from "lucia";
import { eq } from "drizzle-orm";
// UTILS
import { env } from "@/env";
import { stripe } from "@/server/helpers/stripe";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
// SCHEMAS
import {
  orderProductTable,
  orderTable,
  productTable,
} from "@/server/db/schema";
import { CreateSessionInput, PollOrderStatusInput } from "@/lib/schema";
// TYPES
import type Stripe from "stripe";
import { TRPCError } from "@trpc/server";
import type { OrderProductType, ProductType } from "@/lib/schema";
import { sendReceiptEmail } from "@/server/helpers/email";

export const paymentRouter = createTRPCRouter({
  createSession: protectedProcedure
    .input(CreateSessionInput)
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const { productIds } = input;

      if (productIds.length === 0) {
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

      const orderId = generateId(15);

      // create order for user
      await ctx.db.insert(orderTable).values({
        id: orderId,
        isPaid: false,
        userId: user.id,
      });

      // add all products for this order
      await Promise.all(
        validProducts.map(async (product) => {
          const [insertOrderProductQuery] = await ctx.db
            .insert(orderProductTable)
            .values({
              orderId,
              productId: product.id,
            });
          return insertOrderProductQuery.affectedRows;
        }),
      );

      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
      // add cart products to line items
      validProducts.forEach((product) => {
        line_items.push({
          price: product.priceId,
          quantity: 1,
        });
      });

      // add transaction fee product to line items
      line_items.push({
        price: "price_1OtN2NSIZuVcLiYw2rWWc6O3",
        quantity: 1,
        adjustable_quantity: {
          enabled: false,
        },
      });

      try {
        const customer = await stripe.customers.create({
          name: user.name,
          email: user.email,
          address: {
            line1: "Line 1 address",
            postal_code: "758034",
            city: "Kendujhar",
            state: "Odisha",
            country: "IN",
          },
        });

        const stripeSession = await stripe.checkout.sessions.create({
          success_url: `${env.SITE_URL}/thank-you?orderId=${orderId}`,
          cancel_url: `${env.SITE_URL}/cart`,
          payment_method_types: ["card"],
          currency: "INR",
          mode: "payment",
          metadata: {
            userId: user.id,
            orderId,
          },
          line_items,
          customer: customer.id,
        });

        return {
          status: "SUCCESS",
          url: stripeSession.url,
        };
      } catch (error) {
        console.log(error);
        return {
          status: "FAILED",
          url: null,
        };
      }
    }),

  pollOrderStatus: protectedProcedure
    .input(PollOrderStatusInput)
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.query.orderTable.findFirst({
        where: eq(orderTable.id, input.orderId),
        with: {
          orderProducts: true,
          user: true,
        },
      });

      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const products = await Promise.all(
        order.orderProducts.map(async (orderProduct) => {
          const product = await ctx.db.query.productTable.findFirst({
            where: eq(productTable.id, orderProduct.productId),
            with: { productImages: true, productFiles: true },
          });
          return product;
        }),
      );

      const validProducts = products.filter(
        (product) => product !== undefined,
      ) as OrderProductType[];

      if (order.isPaid) {
        await sendReceiptEmail({
          date: new Date(),
          email: order.user.email,
          orderId: order.id,
          products: validProducts,
        });
      }

      return { isPaid: order.isPaid };
    }),
});
