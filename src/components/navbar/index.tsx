import Link from "next/link";
// UTILS
import { buttonVariants } from "@/components/ui/button";
// TYPES
import type { User } from "lucia";
// UI
import { Icons } from "@/components/shared/icons";
import { Separator } from "@/components/ui/separator";
// CUSTOM COMPONENTS
import Cart from "@/components/navbar/cart";
import NavItems from "@/components/navbar/nav-items";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import UserAccountMenu from "@/components/navbar/user-account-menu";

export default function Navbar({ user }: { user: User | null }) {
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
                  {!user && (
                    <>
                      <Link
                        href="/sign-in"
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        Sign In
                      </Link>
                      <Separator orientation="vertical" className="h-6 " />
                    </>
                  )}

                  {user ? (
                    <UserAccountMenu user={user} />
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
