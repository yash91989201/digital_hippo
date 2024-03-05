import * as z from "zod";
import { createSelectSchema } from "drizzle-zod";
// SCHEMAS
import { userTable } from "@/server/db/schema";
// TYPES
import type { Session } from "lucia";

const UserSchema = createSelectSchema(userTable);

const UserSignUpSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

const UserLogInSchema = z.object({
  email: z.string(),
  password: z.string(),
});

type UserSessionType =
  | {
      user: Omit<UserType, "password">;
      session: Session;
    }
  | {
      user: null;
      session: null;
    };

type UserType = z.infer<typeof UserSchema>;
type UserSignUpType = z.infer<typeof UserSignUpSchema>;
type UserLogInType = z.infer<typeof UserLogInSchema>;

export { UserSchema, UserSignUpSchema, UserLogInSchema };

export type { UserType, UserSignUpType, UserLogInType, UserSessionType };
