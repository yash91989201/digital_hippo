import {
  varchar,
  datetime,
  mysqlTable,
  mysqlTableCreator,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const createTable = mysqlTableCreator((name) => `digital_hippo_${name}`);

export const userTable = mysqlTable("user", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["ADMIN", "USER"]).default("USER").notNull(),
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
