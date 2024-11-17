"use client";
import { SessionProvider } from "next-auth/react";

export const SessionProviderWrapper = ({ children }: any) => {
  return <SessionProvider>{children}</SessionProvider>;
};
