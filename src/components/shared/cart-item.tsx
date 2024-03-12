"use client";
import Image from "next/image";
// UTILS;
import { formatPrice } from "@/lib/utils";
// CUSTOM HOOKS
import { useCart } from "@/hooks/use-cart";
// TYPES
import type { CartProductType } from "@/lib/schema";
// UI
import { Button } from "@/components/ui/button";
// ICONS
import { ImageIcon, X } from "lucide-react";
// CONSTANTS
import { PRODUCT_CATEGORIES_LABEL } from "@/constants";

export default function CartItem({ product }: { product: CartProductType }) {
  const { removeItem } = useCart();
  const imageUrl = product?.productImages[0]?.url;
  return (
    <div className="space-y-3 py-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
            {imageUrl ? (
              <Image src={imageUrl} alt="product image" fill />
            ) : (
              <ImageIcon
                arai-hidden="true"
                className="size-4  text-muted-foreground"
              />
            )}
          </div>
          <div className="flex flex-col space-y-2 self-start">
            <p className="line-clamp-1 text-sm font-medium">{product.name}</p>
            <p className="line-clamp-1 text-xs capitalize text-muted-foreground">
              {PRODUCT_CATEGORIES_LABEL[product.category]}
            </p>
            <Button
              className="flex h-fit w-fit items-center justify-center p-1 text-xs text-muted-foreground"
              variant="ghost"
            >
              <X
                className="size-4"
                onClick={() => {
                  removeItem(product.id);
                }}
              />
              <span>Remove</span>
            </Button>
          </div>
        </div>
        <div className="flex flex-col space-y-1 font-medium">
          <span className="ml-auto line-clamp-1 text-sm">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </div>
  );
}
