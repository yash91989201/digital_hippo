import { db } from "@/server/db";
import { verificationTokenTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";

export async function generateVerificationToken(email: string) {
  const verificationToken = generateId(15);
  // token will expire 1 hour after creation
  const expiresAt = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db
      .delete(verificationTokenTable)
      .where(eq(verificationTokenTable.token, existingToken.token));
  }
  await db.insert(verificationTokenTable).values({
    email,
    token: verificationToken,
    expiresAt,
  });

  return verificationToken;
}

export async function getVerificationTokenByEmail(email: string) {
  return db.query.verificationTokenTable.findFirst({
    where: eq(verificationTokenTable.email, email),
  });
}

export async function getVerificationTokenByToken(token: string) {
  return db.query.verificationTokenTable.findFirst({
    where: eq(verificationTokenTable.token, token),
  });
}
