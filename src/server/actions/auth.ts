"use server";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// UTILS
import { db } from "@/server/db";
import { lucia, validateRequest } from "@/lib/auth";
import { sendVerificationEmail } from "@/server/helpers/email";
import {
  generateVerificationToken,
  getVerificationTokenByToken,
} from "@/server/helpers/token";
import { getUserByEmail, hashPassword, verifyPassword } from "@/server/helpers";
// SCHEMAS
import { userTable, verificationTokenTable } from "@/server/db/schema";
import {
  NewVerificationSchema,
  UserSignInSchema,
  UserSignUpSchema,
} from "@/lib/schema";
// TYPES
import type {
  NewVerificationType,
  UserSignInType,
  UserSignUpType,
} from "@/lib/schema";

export async function signUp(
  payload: UserSignUpType,
): Promise<UserSignUpStatusType> {
  const validatedPayload = UserSignUpSchema.safeParse(payload);

  if (!validatedPayload.success) {
    return { status: "FAILED", message: "Invalid Credentials." };
  }

  const userId = generateId(15);
  const { email, name, password } = validatedPayload.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { status: "FAILED", message: "User already exists." };
  }

  const hashedPassword = await hashPassword(password);

  try {
    const [insertUserQuery] = await db.insert(userTable).values({
      id: userId,
      email,
      name,
      password: hashedPassword,
    });

    if (insertUserQuery.affectedRows === 0) {
      return { status: "FAILED", message: "Unable to signup." };
    }

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail({
      email,
      subject: "Verify your email.",
      userName: name,
      verificationToken,
    });

    return { status: "SUCCESS", message: "Verification email sent." };
  } catch (e) {
    return { status: "FAILED", message: "Error occoured." };
  }
}

export async function newVerification(
  payload: NewVerificationType,
): Promise<NewVerificationStatusType> {
  const validatedPayload = NewVerificationSchema.safeParse(payload);
  if (!validatedPayload.success) {
    return { status: "FAILED", message: "Invalid Token!" };
  }

  const { token } = validatedPayload.data;
  const tokenData = await getVerificationTokenByToken(token);

  if (!tokenData) {
    return { status: "FAILED", message: "Invalid Token!" };
  }

  const { expiresAt, email } = tokenData;

  const isTokenExpired = new Date(expiresAt) < new Date();
  if (isTokenExpired) {
    return { status: "FAILED", message: "Token Expired, please try again." };
  }

  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return { status: "FAILED", message: "No user exists with this token!" };
  }

  const [updateUserquery] = await db
    .update(userTable)
    .set({ emailVerified: new Date() });

  await db
    .delete(verificationTokenTable)
    .where(eq(verificationTokenTable.token, token));

  if (updateUserquery.affectedRows == 0) {
    return {
      status: "FAILED",
      message: "Unable to verify email, please try again.",
    };
  }

  return { status: "SUCCESS", message: "Email Verified" };
}

export async function signIn(
  payload: UserSignInType,
): Promise<UserSignInStatusType> {
  const validatedPayload = UserSignInSchema.safeParse(payload);

  if (!validatedPayload.success) {
    return { status: "FAILED", message: "Unable to login." };
  }

  const existingUser = await getUserByEmail(payload.email);

  if (!existingUser) {
    return { status: "FAILED", message: "User doesnot exists!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );

    await sendVerificationEmail({
      email: existingUser.email,
      subject: "Verify your email.",
      userName: existingUser.name,
      verificationToken,
    });
    return {
      status: "FAILED",
      message:
        "Verify your email before logging in. Please check your inbox for verification email.",
    };
  }

  const isPasswordCorrect = await verifyPassword(
    existingUser.password,
    validatedPayload.data.password,
  );

  if (!isPasswordCorrect) {
    return { status: "FAILED", message: "Invalid Credentials." };
  }

  try {
    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return { status: "SUCCESS", message: "Sign Up successful." };
  } catch (e) {
    return { status: "FAILED", message: "Error occoured." };
  }
}

export async function signOut() {
  const { session } = await validateRequest();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/sign-in");
}
