import PaymentStatus from "@/components/shared/payment-status";
import { buttonVariants } from "@/components/ui/button";
import { PRODUCT_CATEGORIES_LABEL, TRANSACTION_FEE } from "@/constants";
import { validateRequest } from "@/lib/auth";
import type {
  ProductFileType,
  ProductImageType,
  ProductType,
} from "@/lib/schema";
import { formatPrice } from "@/lib/utils";
import { db } from "@/server/db";
import { orderTable, productTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

type OrderProductType = ProductType & {
  productImages: ProductImageType[];
  productFiles: ProductFileType[];
};

export default async function ThankyouPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const orderId = searchParams.orderId as string;
  const session = await validateRequest();

  if (!session.user) return <>unauthorized to view this page</>;

  const order = await db.query.orderTable.findFirst({
    where: eq(orderTable.id, orderId),
    with: {
      orderProducts: true,
      user: true,
    },
  });

  if (!order) return notFound();

  const products = await Promise.all(
    order.orderProducts.map(async (orderProduct) => {
      const product = await db.query.productTable.findFirst({
        where: eq(productTable.id, orderProduct.productId),
        with: { productImages: true, productFiles: true },
      });
      return product;
    }),
  );
  const validProducts = products.filter(
    (product) => product !== undefined,
  ) as OrderProductType[];

  const orderUserId = order.userId;
  const orderTotal = validProducts.reduce(
    (total, { price }) => total + price,
    0,
  );

  if (orderUserId !== session.user.id)
    return redirect(`/sign-in?redirectTo=thank-you?orderId=${order.id}`);

  return (
    <main className="relative lg:min-h-full">
      <div className="hidden h-80 overflow-hidden lg:absolute lg:block lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
        <Image
          fill
          src="/checkout-thank-you.jpg"
          className="h-full w-full object-cover object-center"
          alt="thank you for your order"
        />
      </div>
      <div>
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
          <div className="lg:col-start-2">
            <p className="text-sm font-semibold text-primary">
              Order Successful
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Thanks for ordering
            </h1>
            {order.isPaid ? (
              <p className="mt-2 text-base text-muted-foreground">
                Your order was processed and your assets are available to
                downlod below. We&apos; sent your receipt and order details to
                {order.user.email}
              </p>
            ) : (
              <p className="mt-2 text-base text-muted-foreground">
                We appreciate your order! We are currently processing it. So
                hang tight and we will sent you confirmation very soon!
              </p>
            )}
            <div className="mt-16 text-sm font-medium">
              <div className="text-muted-foreground">Order no.</div>
              <div className="mt-2 text-gray-900">{order.id}</div>
              <ul className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground">
                {validProducts.map((product) => {
                  const downloadUrl = product?.productFiles[0]?.url;
                  const imageUrl = product?.productImages[0]?.url;

                  return (
                    <li key={product.id} className="flex space-x-6 py-6">
                      <div className="relative h-24 w-24">
                        {imageUrl ? (
                          <Image
                            fill
                            src={imageUrl}
                            alt={`${product.name} image`}
                            className="flex-none rounded-md bg-gray-100 object-cover object-center"
                          />
                        ) : null}
                      </div>

                      <div className="flex flex-auto flex-col justify-between">
                        <div className="space-y-1">
                          <h3 className="text-gray-900">{product.name}</h3>

                          <p className="my-1">
                            Category:{" "}
                            {PRODUCT_CATEGORIES_LABEL[product.category]}
                          </p>
                        </div>

                        {order.isPaid ? (
                          <a
                            href={downloadUrl}
                            download={product.name}
                            target="_blank"
                            className={buttonVariants({
                              variant: "link",
                              className: "w-fit p-0",
                            })}
                          >
                            Download asset
                          </a>
                        ) : null}
                      </div>

                      <p className="flex-none font-medium text-gray-900">
                        {formatPrice(product.price)}
                      </p>
                    </li>
                  );
                })}
              </ul>
              <div className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p className="text-gray-900">{formatPrice(orderTotal)}</p>
                </div>

                <div className="flex justify-between">
                  <p>Transaction Fee</p>
                  <p className="text-gray-900">
                    {formatPrice(TRANSACTION_FEE)}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                  <p className="text-base">Total</p>
                  <p className="text-base">
                    {formatPrice(orderTotal + TRANSACTION_FEE)}
                  </p>
                </div>
              </div>
              <PaymentStatus
                orderEmail={order.user.email}
                orderId={orderId}
                isPaid={order.isPaid}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
