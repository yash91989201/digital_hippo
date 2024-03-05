"use client";
import React, { createContext } from "react";
// TYPES
import type { UserSessionType } from "@/lib/schema";

export const SessionContext = createContext<UserSessionType>({
  user: null,
  session: null,
});

export default function SessionProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: UserSessionType;
}) {
  return (
    <SessionContext.Provider value={user}>{children}</SessionContext.Provider>
  );
}
