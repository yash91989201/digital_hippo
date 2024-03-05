import "server-only";
import { eq } from "drizzle-orm";
import { Argon2id } from "oslo/password";
// UTILS
import { db } from "@/server/db";
// SCHEMAS
import { userTable } from "@/server/db/schema";

const argon2id = new Argon2id();

export function hashPassword(password: string) {
  return argon2id.hash(password);
}

export function verifyPassword(hashedPassword: string, password: string) {
  return argon2id.verify(hashedPassword, password);
}

export async function getUserByEmail(email: string) {
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.email, email),
  });
  return user;
}
