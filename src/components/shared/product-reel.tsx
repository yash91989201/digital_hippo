"use client";
import { useRouter } from "next/navigation";
// UTILS
import { api } from "@/trpc/react";
import { formatPrice } from "@/lib/utils";
// TYPES
import type { ProductReelQueryType } from "@/lib/schema";
// UI
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
// CUSTOM COMPONENTS
import ImageSlider from "@/components/shared/image-slider";
import ProductShowcase from "@/components/shared/product-showcase";
// CONSTANTS
import { DEFAULT_PRODUCT_REEL_LIMIT } from "@/constants";

type ProductReelProps = {
  title: string;
  subTitle?: string;
  href?: string;
  query: ProductReelQueryType;
};

export default function ProductReel(props: ProductReelProps) {
  const { title, subTitle, href, query } = props;
  const router = useRouter();

  const { data, isLoading } = api.product.getInfiniteProducts.useInfiniteQuery(
    {
      limit: query?.limit ?? DEFAULT_PRODUCT_REEL_LIMIT,
      query,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  const products = data?.pages.flatMap((page) => page.products) ?? [];

  const goToProductPage = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  if (isLoading) {
    return (
      <ProductShowcase title={title} href={href} subTitle={subTitle}>
        <ProductPlaceholder
          cardCount={query?.limit ?? DEFAULT_PRODUCT_REEL_LIMIT}
        />
      </ProductShowcase>
    );
  }

  return (
    <ProductShowcase title={title} href={href} subTitle={subTitle}>
      {products.map((product, index) => (
        <Card
          key={index}
          className="max-w-[240px] cursor-pointer border-0 shadow-none"
          onClick={() => goToProductPage(product.id)}
        >
          <CardContent className="h-52 w-full  p-0">
            <ImageSlider
              className="h-52 w-full"
              imageUrls={product.productImages.map(
                (productImage) => productImage.url,
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-1 p-3 px-0">
            <p className="text-base font-medium text-gray-800">
              {product.name}
            </p>
            <p className="text-sm font-medium text-muted-foreground">
              {product.category}
            </p>
            <p className="text-base font-medium text-gray-800">
              {formatPrice(product.price)}
            </p>
          </CardFooter>
        </Card>
      ))}
    </ProductShowcase>
  );
}

const ProductPlaceholder = ({ cardCount }: { cardCount: number }) => {
  const cards = new Array<null>(cardCount).fill(null);
  return (
    <div className="flex w-full items-center justify-between">
      {cards.map((value, index) => (
        <Card key={index} className="w-full max-w-[240px] border-0 shadow-none">
          <CardContent className="p-0">
            <Skeleton className="h-52 w-full rounded-md" />
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-1 p-3 px-0">
            <Skeleton className="h-3 w-24 rounded-sm" />
            <Skeleton className="h-3 w-12 rounded-sm" />
            <Skeleton className="h-3 w-16 rounded-sm" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
