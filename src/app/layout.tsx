import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { Toaster } from "@/components/ui/sonner";

import { TRPCReactProvider } from "@/trpc/react";
import Navbar from "@/components/navbar";
import SessionProvider from "@/providers/SessionProvider";
import { validateRequest } from "@/lib/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Digital Hippo",
  description: "Digital Assets Marketplace",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await validateRequest();
  return (
    <html lang="en" className="h-full">
      <body
        className={`font-sans ${inter.variable} relative h-full antialiased`}
      >
        <TRPCReactProvider cookies={cookies().toString()}>
          <SessionProvider user={user}>
            <main className="relative flex min-h-screen flex-col">
              <Navbar />
              <div className="flex-1 flex-grow">{children}</div>
            </main>
          </SessionProvider>
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
