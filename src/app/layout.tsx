import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { Toaster } from "@/components/ui/sonner";
// PROVIDERS
import { TRPCReactProvider } from "@/trpc/react";
import { EdgeStoreProvider } from "@/lib/edgestore";
import SessionProvider from "@/providers/SessionProvider";
// UTILS
import { validateRequest } from "@/lib/auth";
// CUSTOM COMPONENTS
import Navbar from "@/components/navbar";

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
            <EdgeStoreProvider>
              <main className="relative flex min-h-screen flex-col">
                <Navbar user={user.user} />
                <div className="flex-1 flex-grow">{children}</div>
              </main>
            </EdgeStoreProvider>
          </SessionProvider>
          <Toaster richColors theme="light" />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
