import { buffer } from "micro";
import { eq } from "drizzle-orm";
// UTILS
import { env } from "@/env";
import { db } from "@/server/db";
import { stripe } from "@/server/helpers/stripe";
// SCHEMAS
import { orderTable } from "@/server/db/schema";
// TYPES
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextApiRequest, response: NextApiResponse) {
  try {
    const stripeSignature = request.headers["stripe-signature"]!;
    const rawBody = await buffer(request);

    const event = stripe.webhooks.constructEvent(
      rawBody.toString(),
      stripeSignature,
      env.STRIPE_WEBHOOK_SECRET,
    );

    switch (event.type) {
      case "checkout.session.async_payment_succeeded": {
        const paymentData = event.data.object;
        const paymentCompleted = paymentData.payment_status === "paid";
        // const userId = paymentData?.metadata?.userId;
        const orderId = paymentData?.metadata?.orderId;
        // TODO add stricter check for existing orderId and userId

        await db
          .update(orderTable)
          .set({ isPaid: paymentCompleted })
          .where(eq(orderTable.id, orderId!));
        break;
      }
    }
    response.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    response.status(500).end();
  }
}
