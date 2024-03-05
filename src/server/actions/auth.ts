"use server";
import { generateId } from "lucia";
import { UserLogInSchema, UserSignUpSchema } from "@/lib/schema";
import type { UserLogInType, UserSignUpType } from "@/lib/schema";

import { db } from "@/server/db";
import { userTable } from "@/server/db/schema";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { getUserByEmail, hashPassword, verifyPassword } from "@/server/helpers";

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

    if (insertUserQuery.affectedRows === 1) {
      return { status: "SUCCESS", message: "Sign Up successful." };
    }

    return { status: "FAILED", message: "Unable to signup." };
  } catch (e) {
    return { status: "FAILED", message: "Error occoured." };
  }
}

export async function logIn(
  payload: UserLogInType,
): Promise<UserLogInStatusType> {
  const validatedPayload = UserLogInSchema.safeParse(payload);

  if (!validatedPayload.success) {
    return { status: "FAILED", message: "Unable to login." };
  }

  const existingUser = await getUserByEmail(payload.email);

  if (!existingUser) {
    return { status: "FAILED", message: "User doesnot exists!" };
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
