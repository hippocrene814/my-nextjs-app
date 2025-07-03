"use client";
import { SessionProvider } from "next-auth/react";
import { MuseumsProvider } from "../context/MuseumsContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <MuseumsProvider>
        {children}
      </MuseumsProvider>
    </SessionProvider>
  );
}
