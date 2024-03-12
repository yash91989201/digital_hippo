import { toast } from "sonner";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number | string,
  options?: {
    currency?: "USD" | "EUR" | "GBP" | "BDT" | "INR";
    notation?: Intl.NumberFormatOptions["notation"];
  },
) {
  const { currency = "INR", notation = "compact" } = options ?? {};
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice);
}

export function fieldActionToast(action?: {
  status: "SUCCESS" | "FAILED";
  message: string;
}) {
  if (action !== undefined) {
    if (action.status === "SUCCESS") {
      toast.success(action.message);
    } else {
      toast.error(action.message);
    }
  }
}
