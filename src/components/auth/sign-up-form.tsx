"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
// ACTIONS
import { signUp } from "@/server/actions/auth";
// SCHEMAS
import { UserSignUpSchema } from "@/lib/schema";
// TYPES
import type { SubmitHandler } from "react-hook-form";
import type { UserSignUpType } from "@/lib/schema";
// CUSTOM COMPONENTS
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthCardWrapper from "@/components/shared/auth-card-wrapper";

export default function SignUpForm() {
  const router = useRouter();

  const signUpForm = useForm<UserSignUpType>({
    resolver: zodResolver(UserSignUpSchema),
  });
  const { control, handleSubmit } = signUpForm;

  const signUpAction: SubmitHandler<UserSignUpType> = async (data) => {
    const actionResponse = await signUp(data);

    toast.info(actionResponse.message);
    if (actionResponse.status === "SUCCESS") {
      router.push("/auth/log-in");
    }
  };

  return (
    <AuthCardWrapper
      headerLabel="Create an account."
      backButtonLabel="Already have an account?"
      backButtonHref="/log-in"
    >
      <Form {...signUpForm}>
        <form className="space-y-3" onSubmit={handleSubmit(signUpAction)}>
          <FormField
            name="name"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-3">
                    <Input {...field} placeholder="Enter your name" />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
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
          <Button className="w-full text-lg font-medium">SignUp</Button>
        </form>
      </Form>
    </AuthCardWrapper>
  );
}
