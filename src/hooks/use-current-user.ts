"use client";
import { use } from "react";
// CONTEXT
import { SessionContext } from "@/providers/SessionProvider";

export default function useCurrentUser() {
  const user = use(SessionContext);
  return user?.user;
}
