import {
  varchar,
  datetime,
  mysqlTable,
  mysqlTableCreator,
  mysqlEnum,
  timestamp,
  boolean,
  text,
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

export const sessionTable = mysqlTable("session", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 255,
  })
    .notNull()
    .references(() => userTable.id),
  expiresAt: datetime("expires_at").notNull(),
});

export const verificationTokenTable = mysqlTable("verification_token", {
  email: varchar("email", { length: 255 }).notNull().unique(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
});
