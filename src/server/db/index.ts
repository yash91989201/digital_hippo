import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { DrizzleMySQLAdapter } from "@lucia-auth/adapter-drizzle";

import { env } from "@/env";
import * as schema from "./schema";

export const db = drizzle(
  mysql.createPool({
    uri: env.DATABASE_URL,
  }),
  { schema, mode: "default", logger: true },
);

export const luciaDbAdapter = new DrizzleMySQLAdapter(
  db,
  schema.sessionTable,
  schema.userTable,
);
