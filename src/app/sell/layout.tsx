import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import React from "react";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MaxWidthWrapper>{children}</MaxWidthWrapper>;
}
