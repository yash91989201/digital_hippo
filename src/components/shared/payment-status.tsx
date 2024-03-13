"use client";

import { useCart } from "@/hooks/use-cart";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface PaymentStatusProps {
  orderEmail: string;
  orderId: string;
  isPaid: boolean;
}

export default function PaymentStatus({
  orderEmail,
  orderId,
  isPaid,
}: PaymentStatusProps) {
  const router = useRouter();
  const { clearCart } = useCart();

  const { data } = api.payment.pollOrderStatus.useQuery(
    { orderId },
    {
      enabled: isPaid === false,
      refetchInterval: (data) => (data?.isPaid ? false : 1000),
    },
  );

  useEffect(() => {
    if (data?.isPaid) {
      router.refresh();
      clearCart();
    }
  }, [data?.isPaid, router, clearCart]);

  return (
    <div className="mt-16 grid grid-cols-2 gap-x-4 text-sm text-gray-600">
      <div>
        <p className="font-medium text-gray-900">Shipping To</p>
        <p>{orderEmail}</p>
      </div>

      <div>
        <p className="font-medium text-gray-900">Order Status</p>
        <p>{isPaid ? "Payment successful" : "Pending payment"}</p>
      </div>
    </div>
  );
}