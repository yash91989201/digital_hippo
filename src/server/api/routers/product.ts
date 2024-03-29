import { and, eq } from "drizzle-orm";
import { withCursorPagination } from "drizzle-pagination";
// UTILS
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { stripe } from "@/server/helpers/stripe";
// SCHEMAS
import {
  productFileTable,
  productImageTable,
  productTable,
} from "@/server/db/schema";
import type { ProductFileType, ProductImageType } from "@/lib/schema";
// TYPES
import {
  CreateProductSchema,
  GetProductReelDataInput,
  GetProductSchema,
} from "@/lib/schema";

export const productRouter = createTRPCRouter({
  getProduct: publicProcedure
    .input(GetProductSchema)
    .query(({ ctx, input }) => {
      return ctx.db.query.productTable.findFirst({
        where: and(
          eq(productTable.id, input.id),
          eq(productTable.approvedForSale, true),
        ),
        with: {
          productImages: true,
        },
      });
    }),
  getInfiniteProducts: publicProcedure
    .input(GetProductReelDataInput)
    .query(async ({ ctx, input }) => {
      const { query, cursor } = input;
      const { sort } = query;

      const paginationProps = withCursorPagination({
        where: eq(productTable.approvedForSale, true),
        limit: input.limit,
        cursors: [
          [productTable.createdAt, sort, cursor ? new Date(cursor) : undefined],
        ],
      });

      const products = await ctx.db.query.productTable.findMany({
        ...paginationProps,
        with: {
          productImages: true,
        },
      });

      return {
        products,
        nextCursor: products.length
          ? products[products.length - 1]?.createdAt.toISOString()
          : null,
      };
    }),

  createProduct: protectedProcedure
    .input(CreateProductSchema)
    .mutation(async ({ ctx, input }): Promise<CreateProductStatusType> => {
      const { productFiles, productImages, ...productData } = input;

      let createProductStatus: CreateProductStatusType = {
        status: "INITIAL",
      };

      const [insertProductQuery] = await ctx.db.insert(productTable).values({
        ...productData,
        createdAt: new Date(),
      });

      if (insertProductQuery.affectedRows === 0) {
        return {
          status: "FAILED",
          message: "Unable to add product, try again.",
        };
      }

      createProductStatus = {
        status: "SUCCESS",
        message: "Product added",
      };

      const createdProduct = await stripe.products.create({
        name: productData.name,
        default_price_data: {
          currency: "INR",
          unit_amount: Math.round(productData.price * 100),
        },
      });

      const [updateProductQuery] = await ctx.db
        .update(productTable)
        .set({
          stripeId: createdProduct.id,
          priceId: createdProduct.default_price as string,
        })
        .where(eq(productTable.id, productData.id));

      console.log({ insertProductQuery, updateProductQuery });

      const productFilesData: ProductFileType[] = productFiles.map(
        (productFile) => ({
          ...productFile,
          productId: productData.id,
        }),
      );

      const productImagesData: ProductImageType[] = productImages.map(
        (productImage) => ({
          ...productImage,
          productId: productData.id,
        }),
      );

      const [insertProductFilesQuery] = await ctx.db
        .insert(productFileTable)
        .values(productFilesData);

      if (insertProductFilesQuery.affectedRows === 0) {
        createProductStatus = {
          ...createProductStatus,
          fields: {
            ...createProductStatus.fields,
            productFiles: {
              ...createProductStatus.fields?.productFiles,
              insert: {
                status: "FAILED",
                message: "Unable to add product files.",
              },
            },
          },
        };
      } else {
        createProductStatus = {
          ...createProductStatus,
          fields: {
            ...createProductStatus.fields,
            productFiles: {
              ...createProductStatus.fields?.productFiles,
              insert: {
                status: "SUCCESS",
                message: `${insertProductFilesQuery.affectedRows} of ${productFiles.length} product file(s) added.`,
              },
            },
          },
        };
      }

      const [insertProductImagesQuery] = await ctx.db
        .insert(productImageTable)
        .values(productImagesData);

      if (insertProductImagesQuery.affectedRows === 0) {
        createProductStatus = {
          ...createProductStatus,
          fields: {
            ...createProductStatus.fields,
            productImages: {
              ...createProductStatus.fields?.productImages,
              insert: {
                status: "FAILED",
                message: "Unable to add product files.",
              },
            },
          },
        };
      } else {
        createProductStatus = {
          ...createProductStatus,
          fields: {
            ...createProductStatus.fields,
            productImages: {
              ...createProductStatus.fields?.productImages,
              insert: {
                status: "SUCCESS",
                message: `${insertProductImagesQuery.affectedRows} of ${productImages.length} product image(s) added.`,
              },
            },
          },
        };
      }

      return createProductStatus;
    }),

  // updateProduct: proctectedProcedure.input().mutation(async () => {
  //   // other update logic
  //   // strip product update logic
  //   const updatedProduct = await stripe.products.update(stripeId, {
  //     name: productName,
  //     default_price: productPrice,
  //   });
  // }),
});
