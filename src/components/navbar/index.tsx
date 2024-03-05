"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
// UTILS
import { buttonVariants } from "@/components/ui/button";
// CUSTOM COMPONENTS
import Cart from "@/components/navbar/cart";
import { Icons } from "@/components/shared/icons";
import NavItems from "@/components/navbar/nav-items";
import { Separator } from "@/components/ui/separator";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import useCurrentUser from "@/hooks/use-current-user";

export default function Navbar() {
  const pathname = usePathname();
  const user = useCurrentUser();

  if (["/log-in", "/sign-up"].includes(pathname)) return null;

  return (
    <div className="sticky inset-x-0 top-0 z-50 h-16 bg-white">
      <header className="relative bg-white">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <div className="ml-4 flex lg:ml-0">
                <Link href="/">
                  <Icons.logo className="h-10 w-10" />
                </Link>
              </div>

              <div className="z-50 hidden lg:ml-8 lg:block lg:self-stretch">
                <NavItems />
              </div>

              <div className="ml-auto flex items-center">
                <div className="lg:items-centerlg:justify-end hidden lg:flex lg:flex-1 lg:space-x-6"></div>
              </div>

              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {user == null && (
                    <>
                      <Link
                        href="/log-in"
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        Log In
                      </Link>
                      <Separator orientation="vertical" className="h-6 " />
                    </>
                  )}

                  {user ? (
                    <p></p>
                  ) : (
                    <Link
                      href="/sign-up"
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      Create Account
                    </Link>
                  )}

                  {user && (
                    <Separator orientation="vertical" className="h-6 " />
                  )}

                  {!user && (
                    <div className="flex lg:ml-6">
                      <Separator orientation="vertical" className="h-6 " />
                    </div>
                  )}

                  <div className="flex-root ml-4 lg:ml-6">
                    <Cart />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
}
