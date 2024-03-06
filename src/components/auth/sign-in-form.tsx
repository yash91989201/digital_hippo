"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
// ACTIONS
import { signIn } from "@/server/actions/auth";
// SCHEMAS
import { UserSignInSchema } from "@/lib/schema";
// TYPES
import type { SubmitHandler } from "react-hook-form";
import type { UserSignInType } from "@/lib/schema";
// UI
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// CUSTOM COMPONENTS
import AuthCardWrapper from "@/components/shared/auth-card-wrapper";
// ICONS
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSeller = searchParams.get("as") === "seller";
  const redirectTo = searchParams.get("redirectTo") ?? "/";

  const signInForm = useForm<UserSignInType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(UserSignInSchema),
    shouldUseNativeValidation: true,
  });
  const { formState, control, handleSubmit } = signInForm;

  const signInAction: SubmitHandler<UserSignInType> = async (formData) => {
    const actionResponse = await signIn(formData);

    if (actionResponse.status === "SUCCESS") {
      toast.success(actionResponse.message);
      setTimeout(() => {
        if (isSeller) {
          return router.replace("/sell");
        }
        router.replace(redirectTo);
      }, 1000);
    }
    if (actionResponse.status === "FAILED") {
      toast.error(actionResponse.message);
    }
  };

  const continueAsSeller = () => {
    router.push("?as=seller");
  };

  const continueAsBuyer = () => {
    router.replace("/sign-in", undefined);
  };

  return (
    <AuthCardWrapper
      headerLabel={`Sign In to your ${isSeller ? "seller" : ""} account`}
      backButtonLabel="Don't have an account? Sign Up"
      backButtonHref="/sign-up"
    >
      <Form {...signInForm}>
        <form className="space-y-3" onSubmit={handleSubmit(signInAction)}>
          <FormField
            name="email"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-3">
                    <Input
                      {...field}
                      placeholder="Enter your email"
                      type="email"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-3">
                    <Input {...field} placeholder="********" type="password" />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            className="flex w-full items-center justify-center gap-3 text-lg font-medium"
            disabled={formState.isSubmitting}
          >
            <span>Sign In</span>
            {formState.isSubmitting && <Loader2 className="animate-spin" />}
          </Button>

          <div className="relative py-6">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1.5  text-gray-500">
              OR
            </span>
            <Separator orientation="horizontal" />
          </div>

          {isSeller ? (
            <Button
              className="w-full"
              variant="secondary"
              type="button"
              onClick={continueAsBuyer}
              disabled={formState.isSubmitting}
            >
              Continue as customer
            </Button>
          ) : (
            <Button
              className="w-full"
              variant="secondary"
              type="button"
              onClick={continueAsSeller}
              disabled={formState.isSubmitting}
            >
              Continue as seller
            </Button>
          )}
        </form>
      </Form>
    </AuthCardWrapper>
  );
}
