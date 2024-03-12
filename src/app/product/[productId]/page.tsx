import { Fragment } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
// UTILS
import { api } from "@/trpc/server";
import { formatPrice } from "@/lib/utils";
// CUSTOM COMPONENTS
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
// ICONS
import { Check, Shield, Slash } from "lucide-react";
// CUSTOM COMPONENTS
import ImageSlider from "@/components/shared/image-slider";
import AddToCartButton from "@/components/products/add-to-cart-button";
// CONSTANTS
import {
  PRODUCT_CATEGORIES_LABEL,
  PRODUCT_PAGE_BREADCRUMBS,
} from "@/constants";

export default async function ProductPage({
  params,
}: {
  params: {
    productId: string;
  };
}) {
  const product = await api.product.getProduct.query({ id: params.productId });

  if (!product) {
    return notFound();
  }
  const productImageUrls = product.productImages.map(
    (productImage) => productImage.url,
  );

  return (
    <MaxWidthWrapper className="bg-white">
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          {/* Product Details */}
          <div className="lg:max-w-lg lg:self-end">
            <ol className="flex items-center space-x-2">
              {PRODUCT_PAGE_BREADCRUMBS.map((breadCrumb, index) => (
                <Fragment key={breadCrumb.href}>
                  <li className="flex items-center text-sm">
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
                </Fragment>
              ))}
            </ol>

            <div className="mt-4">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {product.name}
              </h1>
            </div>

            <section className="mt-4">
              <div className="flex items-center">
                <p className="font-medium text-gray-900">
                  {formatPrice(product.price)}
                </p>

                <div className="ml-4 border-l border-gray-300 pl-4 text-muted-foreground">
                  {PRODUCT_CATEGORIES_LABEL[product.category]}
                </div>
              </div>

              <div className="mt-4 space-y-6">
                <p className="text-base text-muted-foreground">
                  {product.description}
                </p>
              </div>

              <div className="mt-6 flex items-center">
                <Check
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0 text-green-500"
                />
                <p className="ml-2 text-sm text-muted-foreground">
                  Eligible for instant delivery
                </p>
              </div>
            </section>
          </div>

          {/* Product images */}
          <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
            <ImageSlider
              className="aspect-square h-80"
              imageUrls={productImageUrls}
            />
          </div>

          {/* add to cart part */}
          <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
            <div>
              <div className="mt-10">
                <AddToCartButton product={product} />
              </div>
              <div className="mt-6 text-center">
                <div className="text-medium group inline-flex text-sm">
                  <Shield
                    aria-hidden="true"
                    className="mr-2 h-5 w-5 flex-shrink-0 text-gray-400"
                  />
                  <span className="text-muted-foreground hover:text-gray-700">
                    30 Day Return Guarantee
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
