import { relations } from "drizzle-orm";
import {
  varchar,
  datetime,
  mysqlTable,
  mysqlTableCreator,
  mysqlEnum,
  timestamp,
  boolean,
  text,
  int,
  primaryKey,
} from "drizzle-orm/mysql-core";

export const createTable = mysqlTableCreator((name) => `digital_hippo_${name}`);

export const userTable = mysqlTable("user", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["ADMIN", "USER"]).default("USER").notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  imageUrl: text("image_url"),
});

export const userTableRelations = relations(userTable, ({ many }) => ({
  images: many(imageTable),
  files: many(fileTable),
  products: many(productTable),
  productImages: many(productImageTable),
  productFiles: many(productFileTable),
  orders: many(orderTable),
}));

export const sessionTable = mysqlTable("session", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  expiresAt: datetime("expires_at").notNull(),
  // FOREIGN KEY RELATIONS
  userId: varchar("user_id", {
    length: 255,
  })
    .notNull()
    .references(() => userTable.id),
});

export const verificationTokenTable = mysqlTable("verification_token", {
  email: varchar("email", { length: 255 }).notNull().unique(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
});

export const imageTable = mysqlTable("image", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  url: text("url").notNull(),
  size: int("size").notNull(),
  // FOREIGN KEY RELATIONS
  userId: varchar("user_id", {
    length: 255,
  })
    .notNull()
    .references(() => userTable.id),
});

export const imageTableRelations = relations(imageTable, ({ one }) => ({
  user: one(userTable, {
    fields: [imageTable.userId],
    references: [userTable.id],
  }),
}));

export const fileTable = mysqlTable("file", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  url: text("url").notNull(),
  size: int("size").notNull(),
  // FOREIGN KEY RELATIONS
  userId: varchar("user_id", {
    length: 255,
  })
    .notNull()
    .references(() => userTable.id),
});

export const fileTableRelations = relations(fileTable, ({ one }) => ({
  user: one(userTable, {
    fields: [fileTable.userId],
    references: [userTable.id],
  }),
}));

export const productTable = mysqlTable("product", {
  createdAt: datetime("created_at").notNull(),
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: int("price").notNull(),
  category: mysqlEnum("category", ["UI_KITS", "ICONS"]).notNull(),
  saleStatus: mysqlEnum("sale_status", ["PENDING", "APPROVED", "DENIED"])
    .default("PENDING")
    .notNull(),
  approvedForSale: boolean("approved_for_sale").default(false).notNull(),
  priceId: varchar("price_id", { length: 255 }).notNull(),
  stripeId: varchar("stripe_id", { length: 255 }).notNull(),
  // FOREIGN KEY RELATIONS
  userId: varchar("user_id", {
    length: 255,
  })
    .notNull()
    .references(() => userTable.id),
});

export const productTableRelations = relations(
  productTable,
  ({ many, one }) => ({
    user: one(userTable, {
      fields: [productTable.userId],
      references: [userTable.id],
    }),
    productImages: many(productImageTable),
    productFiles: many(productFileTable),
  }),
);

export const productImageTable = mysqlTable("product_image", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  url: text("url").notNull(),
  size: int("size").notNull(),
  // FOREIGN KEY RELATIONS
  userId: varchar("user_id", {
    length: 255,
  })
    .notNull()
    .references(() => userTable.id),
  productId: varchar("product_id", {
    length: 255,
  })
    .notNull()
    .references(() => productTable.id),
});

export const productImageTableRelations = relations(
  productImageTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [productImageTable.userId],
      references: [userTable.id],
    }),
    product: one(productTable, {
      fields: [productImageTable.productId],
      references: [productTable.id],
    }),
  }),
);

export const productFileTable = mysqlTable("product_file", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  url: text("url").notNull(),
  size: int("size").notNull(),
  // FOREIGN KEY RELATIONS
  userId: varchar("user_id", {
    length: 255,
  })
    .notNull()
    .references(() => userTable.id),
  productId: varchar("product_id", {
    length: 255,
  })
    .notNull()
    .references(() => productTable.id),
});

export const productFileTableRelations = relations(
  productFileTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [productFileTable.userId],
      references: [userTable.id],
    }),
    product: one(productTable, {
      fields: [productFileTable.productId],
      references: [productTable.id],
    }),
  }),
);

export const orderTable = mysqlTable("order", {
  id: varchar("id", { length: 255 }).primaryKey(),
  isPaid: boolean("is_paid").default(false).notNull(),
  // FOREIGN KEY RELATIONS
  userId: varchar("user_id", {
    length: 255,
  })
    .notNull()
    .references(() => userTable.id),
});

export const orderTableRelations = relations(orderTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [orderTable.userId],
    references: [userTable.id],
  }),
  orderProducts: many(orderProductTable),
}));

export const orderProductTable = mysqlTable(
  "order_product",
  {
    // FOREIGN KEY RELATIONS
    orderId: varchar("order_id", {
      length: 255,
    })
      .notNull()
      .references(() => orderTable.id),
    productId: varchar("product_id", {
      length: 255,
    })
      .notNull()
      .references(() => productTable.id),
  },
  (table) => ({
    compositeKey: primaryKey({
      name: "orderProductsKey",
      columns: [table.orderId, table.productId],
    }),
  }),
);

export const orderProductsTableRelation = relations(
  orderProductTable,
  ({ one }) => ({
    order: one(orderTable, {
      fields: [orderProductTable.orderId],
      references: [orderTable.id],
    }),
  }),
);
