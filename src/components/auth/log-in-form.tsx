"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
// ACTIONS
import { logIn } from "@/server/actions/auth";
// SCHEMAS
import { UserLogInSchema } from "@/lib/schema";
// TYPES
import type { SubmitHandler } from "react-hook-form";
import type { UserLogInType } from "@/lib/schema";
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

export default function LogInForm() {
  const router = useRouter();

  const signUpForm = useForm<UserLogInType>({
    resolver: zodResolver(UserLogInSchema),
    shouldUseNativeValidation: true,
  });
  const { control, handleSubmit } = signUpForm;

  const signUpAction: SubmitHandler<UserLogInType> = async (formData) => {
    const actionResponse = await logIn(formData);

    toast.info(actionResponse.message);
    if (actionResponse.status === "SUCCESS") {
      router.push("/protected");
    }
  };

  return (
    <AuthCardWrapper
      headerLabel="Welcome Back!"
      backButtonLabel="Don't have an account?"
      backButtonHref="/sign-up"
    >
      <Form {...signUpForm}>
        <form onSubmit={handleSubmit(signUpAction)}>
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
          <Button>SignUp</Button>
        </form>
      </Form>
    </AuthCardWrapper>
  );
}
