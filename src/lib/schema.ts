import * as z from "zod";
import { createSelectSchema } from "drizzle-zod";
// SCHEMAS
import {
  fileTable,
  imageTable,
  orderProductTable,
  orderTable,
  productFileTable,
  productImageTable,
  productTable,
  userTable,
} from "@/server/db/schema";
// TYPES
import type { Session } from "lucia";

export const UserSchema = createSelectSchema(userTable);
export const ImageSchema = createSelectSchema(imageTable);
export const FileSchema = createSelectSchema(fileTable);
export const ProductSchema = createSelectSchema(productTable);
export const ProductImageSchema = createSelectSchema(productImageTable);
export const ProductFileSchema = createSelectSchema(productFileTable);
export const OrderSchema = createSelectSchema(orderTable);
export const OrderProductsSchema = createSelectSchema(orderProductTable);

export const UserSignUpSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export const UserSignInSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const NewVerificationSchema = z.object({
  token: z.string(),
});

export const CreateProductSchema = ProductSchema.extend({
  productFiles: z
    .array(FileSchema)
    .min(1, { message: "At least one product file is required" }),
  productImages: z
    .array(ImageSchema)
    .min(1, { message: "At least one product image is required" })
    .max(2, { message: "Upto 2 images are allowed" }),
});

export const AddFileSchema = z.object({
  files: z.array(FileSchema),
});

export const AddImageSchema = z.object({
  images: z.array(ImageSchema),
});

export const ProductReelQuery = z.object({
  category: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  limit: z.number(),
});

export const GetProductReelDataInput = z.object({
  limit: z.number().min(1).max(100),
  cursor: z.date().nullish(),
  query: ProductReelQuery.omit({ limit: true }),
});

export const GetProductSchema = z.object({
  id: z.string(),
});

export const CreateSessionInput = z.object({
  productIds: z.array(z.string()),
});

export const PollOrderStatusInput = z.object({
  orderId: z.string(),
});

export type UserType = z.infer<typeof UserSchema>;
export type FileType = z.infer<typeof FileSchema>;
export type ImageType = z.infer<typeof ImageSchema>;
export type ProductType = z.infer<typeof ProductSchema>;
export type ProductFileType = z.infer<typeof ProductFileSchema>;
export type ProductImageType = z.infer<typeof ProductImageSchema>;
export type OrderType = z.infer<typeof OrderSchema>;

export type UserSignUpType = z.infer<typeof UserSignUpSchema>;
export type UserSignInType = z.infer<typeof UserSignInSchema>;
export type NewVerificationType = z.infer<typeof NewVerificationSchema>;
export type UserSessionType =
  | {
      user: Omit<UserType, "password">;
      session: Session;
    }
  | {
      user: null;
      session: null;
    };

export type CreateProductType = z.infer<typeof CreateProductSchema>;
export type AddImageType = z.infer<typeof AddImageSchema>;
export type ProductReelQueryType = z.infer<typeof ProductReelQuery>;
export type GetProductReelDataInputType = z.infer<
  typeof GetProductReelDataInput
>;

export type CartProductType = ProductType & {
  productImages: ProductImageType[];
};

export type CartStoreType = {
  items: CartProductType[];
  addItem: (product: CartProductType) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

export type OrderProductType = ProductType & {
  productImages: ProductImageType[];
  productFiles: ProductFileType[];
};

export type ReceiptEmailProps = {
  email: string;
  date: Date;
  orderId: string;
  products: OrderProductType[];
};
