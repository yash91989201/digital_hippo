import Link from "next/link";
// CUSTOM COMPONENTS
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
// ICONS
import { Slash } from "lucide-react";
// CONSTANTS
import { PRODUCT_PAGE_BREADCRUMBS } from "@/constants";

export default function ProductNotFound() {
  return (
    <MaxWidthWrapper className="bg-white">
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          {/* PRODUCT DETAILS */}
          <div className="lg:max-w-lg lg:self-end">
            <ol className="flex items-center gap-2">
              {PRODUCT_PAGE_BREADCRUMBS.map((breadCrumb, index) => (
                <>
                  <li
                    key={breadCrumb.href}
                    className="flex items-center text-sm"
                  >
                    <Link
                      className="text-sm font-medium text-muted-foreground hover:text-gray-900"
                      href={breadCrumb.href}
                    >
                      {breadCrumb.name}
                    </Link>
                  </li>
                  {index !== PRODUCT_PAGE_BREADCRUMBS.length - 1 ? (
                    <Slash className="size-4" />
                  ) : null}
                </>
              ))}
            </ol>
            <div className="mt-4 ">
              <h1>No product found!</h1>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
