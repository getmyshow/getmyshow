import React from "react";
import { ClerkProvider } from "@clerk/nextjs";

interface ClerkAuthProviderProps {
  children: React.ReactNode;
}

export default function ClerkAuthProvider({ children }: ClerkAuthProviderProps) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
