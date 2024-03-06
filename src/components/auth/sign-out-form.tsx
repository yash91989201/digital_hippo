import React from "react";
// ACTIONS
import { signOut } from "@/server/actions/auth";

export default function SignOutForm({
  children,
}: {
  children: React.ReactNode;
}) {
  return <form action={signOut}>{children}</form>;
}
