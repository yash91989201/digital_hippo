import * as z from "zod";
import { createSelectSchema } from "drizzle-zod";
// SCHEMAS
import { userTable } from "@/server/db/schema";
// TYPES
import type { Session } from "lucia";

export const UserSchema = createSelectSchema(userTable);

export const UserSignUpSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export const UserLogInSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const NewVerificationSchema = z.object({
  token: z.string(),
});

export type UserType = z.infer<typeof UserSchema>;
export type UserSignUpType = z.infer<typeof UserSignUpSchema>;
export type UserLogInType = z.infer<typeof UserLogInSchema>;
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
