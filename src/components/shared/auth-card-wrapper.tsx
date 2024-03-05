"use client";
import Link from "next/link";
// CUSTOM COMPONENTS
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

export default function AuthCardWrapper({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
}: AuthCardWrapperProps) {
  return (
    <Card className="w-[80vw] shadow-lg md:max-w-[480px]">
      <CardHeader className="flex flex-col items-center justify-center gap-y-3">
        <Link href="/">
          <Icons.logo className="h-16 w-16" />
        </Link>
        <p className="text-base text-gray-500">{headerLabel}</p>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {backButtonLabel && backButtonHref && (
        <CardFooter className="flex flex-col gap-3">
          <Button
            variant="link"
            className="w-full font-normal"
            size="sm"
            asChild
          >
            <Link href={backButtonHref}>{backButtonLabel}</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
