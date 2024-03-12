"use client";
import Link from "next/link";
// UTILS
import { buttonVariants } from "@/components/ui/button";
// ICONS
import { ArrowRight } from "lucide-react";

type ProductShowCaseProps = {
  title: string;
  subTitle?: string;
  href?: string;
  children: React.ReactNode;
};

export default function ProductShowcase(props: ProductShowCaseProps) {
  const { title, subTitle, href, children } = props;

  return (
    <section>
      <div className="mb-4 md:flex md:items-center md:justify-between">
        <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {title}
          </h1>
          {subTitle ? (
            <p className="mt-2 text-sm text-muted-foreground">{subTitle}</p>
          ) : null}
        </div>
        {href ? (
          <Link
            href={href}
            className={buttonVariants({
              variant: "link",
              className: "hidden items-center justify-center gap-1 md:flex",
            })}
          >
            <span>Shop the collection</span>
            <ArrowRight className="size-4" />
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
