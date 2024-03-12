"use client";
import Image from "next/image";
import Link from "next/link";
// UTILS
import { cn, formatPrice } from "@/lib/utils";
// CUSTOM HOOKS
import { useCart } from "@/hooks/use-cart";
// UI
import { Button } from "@/components/ui/button";
// ICONS
import { Check, X } from "lucide-react";
// CONSTANTS
import { PRODUCT_CATEGORIES_LABEL, TRANSACTION_FEE } from "@/constants";

export default function CartPage() {
  const { items, removeItem } = useCart();
  const cartTotal = items.reduce((total, { price }) => total + price, 0);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div
            className={cn("lg:col-span-7", {
              "rounded-lg border-2 border-dashed border-zinc-200 p-12":
                items.length === 0,
            })}
          >
            <h2 className="sr-only">Items in your shopping cart</h2>

            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-1">
                <div
                  aria-hidden="true"
                  className="relative mb-4 h-40 w-40 text-muted-foreground"
                >
                  <Image
                    src="/hippo-empty-cart.png"
                    fill
                    loading="eager"
                    alt="empty shopping cart hippo"
                  />
                </div>
                <h3 className="text-2xl font-semibold">Your cart is empty</h3>
                <p className="text-center text-muted-foreground">
                  Whoops! Nothing to show here yet.
                </p>
              </div>
            ) : null}

            <ul
              className={cn({
                "divide-y divide-gray-200 border-b border-t border-gray-200":
                  items.length > 0,
              })}
            >
              {items.map((item) => {
                const imageUrl = item?.productImages[0]?.url;

                return (
                  <li key={item.id} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      <div className="relative h-24 w-24">
                        {imageUrl ? (
                          <Image
                            fill
                            src={imageUrl}
                            alt="item image"
                            className="h-full w-full rounded-md object-cover object-center sm:h-48 sm:w-48"
                          />
                        ) : null}
                      </div>
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <Link
                                href={`/item/${item.id}`}
                                className="font-medium text-gray-700 hover:text-gray-800"
                              >
                                {item.name}
                              </Link>
                            </h3>
                          </div>

                          <div className="mt-1 flex text-sm">
                            <p className="text-muted-foreground">
                              Category:
                              {PRODUCT_CATEGORIES_LABEL[item.category]}
                            </p>
                          </div>

                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        <div className="mt-4 w-20 sm:mt-0 sm:pr-9">
                          <div className="absolute right-0 top-0">
                            <Button
                              aria-label="remove item"
                              onClick={() => removeItem(item.id)}
                              variant="ghost"
                            >
                              <X className="h-5 w-5" aria-hidden="true" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                        <Check className="h-5 w-5 flex-shrink-0 text-green-500" />

                        <span>Eligible for instant delivery</span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatPrice(cartTotal)}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>Flat Transaction Fee</span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {formatPrice(TRANSACTION_FEE)}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-base font-medium text-gray-900">
                  Order Total
                </div>
                <div className="text-base font-medium text-gray-900">
                  {formatPrice(cartTotal + TRANSACTION_FEE)}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                disabled={items.length === 0}
                // onClick={() => createCheckoutSession({ productIds })}
                className="w-full"
                size="lg"
              >
                {/* {isLoading ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : null} */}
                Checkout
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
