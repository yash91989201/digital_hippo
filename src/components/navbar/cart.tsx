"use client";
import Link from "next/link";
import Image from "next/image";
// CUSTOM HOOKS
import { useCart } from "@/hooks/use-cart";
// UTILS
import { formatPrice } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
// UI
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
// CUSTOM COMPONENTS
import CartItem from "@/components/shared/cart-item";
// ICONS
import { ShoppingCart } from "lucide-react";
// CONSTANTS
import { TRANSACTION_FEE } from "@/constants";

export default function Cart() {
  const { items } = useCart();
  const itemCount = items.length;
  const cartTotal = items.reduce((total, { price }) => total + price, 0);

  return (
    <Sheet>
      <SheetTrigger className="group  -m-2 flex items-center p-2 ">
        <ShoppingCart
          className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500 "
          aria-hidden="true"
        />
        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
          {itemCount}
        </span>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Cart({formatPrice(cartTotal)})</SheetTitle>
        </SheetHeader>
        {itemCount > 0 ? (
          <>
            <div className="flex w-full flex-col pr-6">
              <ScrollArea>
                {items.map((item, index) => (
                  <CartItem key={index} product={item} />
                ))}
              </ScrollArea>
            </div>

            <div className="space-y-4 pr-6">
              <Separator />
              <div className="space-y-1 text-sm">
                <div className="flex">
                  <span className="flex-1">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Transaction Fee</span>
                  <span>{formatPrice(TRANSACTION_FEE)}</span>
                </div>
                <p className="text-right">
                  {formatPrice(cartTotal + TRANSACTION_FEE)}
                </p>
              </div>
              <SheetFooter>
                <SheetTrigger asChild>
                  <Link
                    href="/cart"
                    className={buttonVariants({
                      className: "w-full",
                    })}
                  >
                    Continue to Checkout
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <div
              className="relative mb-4 h-60 w-60 text-muted-foreground"
              aria-hidden="true"
            >
              <Image
                src="/hippo-empty-cart.png"
                alt="Shopping Cart Empty"
                fill
              />
            </div>
            <p className="text-xl font-semibold">Your cart is empty</p>
            <SheetTrigger>
              <Link
                href="/products"
                className={buttonVariants({
                  variant: "link",
                  size: "sm",
                  className: "text-sm text-muted-foreground",
                })}
              >
                Add items to your cart to checkout.
              </Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
