"use client";
// CUSTOM HOOKS
import { useCart } from "@/hooks/use-cart";
// TYPES
import type { CartProductType } from "@/lib/schema";
// UI
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AddToCartButton({
  product,
}: {
  product: CartProductType;
}) {
  const { addItem } = useCart();
  return (
    <>
      <Button
        size="lg"
        className="w-full "
        onClick={() => {
          addItem(product);
          toast.success(`${product.name} added to cart!`);
        }}
      >
        Add to Cart
      </Button>
    </>
  );
}
