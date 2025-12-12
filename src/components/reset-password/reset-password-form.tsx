"use client";

import { useState } from "react";

import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FieldError } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "At least  8 character expected")
      .max(30, "Could not exceed 30 characters")
      .regex(/[A-Z]/, "At least one uppercase expected")
      .regex(/[a-z]/, "At least one lowercase expected")
      .regex(/[0-9]/, "At least one digit expected")
      .regex(/[!@#$%^&*]/, "At least one symbol expected"),
    confirmPassword: z.string(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ["confirmPassword"],
    message: "passwords didn't match",
  });

const ResetPasswordForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm({ resolver: zodResolver(formSchema) });

  if (!token) return <p>LINK ARE INVALID</p>;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const res = await authClient.resetPassword({
      newPassword: data.password,
      token: token as string,
    });

    if (res.error) {
      toast("something is wrong");
    } else router.push("/");
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      {/* Password */}
      <div className="w-full space-y-1">
        <Label className="leading-5" htmlFor="password">
          New Password*
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            placeholder="••••••••••••••••"
            className="pr-9"
            {...form.register("password")}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPasswordVisible((prevState) => !prevState)}
            className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
          >
            {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
            <span className="sr-only">
              {isPasswordVisible ? "Hide password" : "Show password"}
            </span>
          </Button>
        </div>
        {form.formState.errors.password && (
          <FieldError errors={[form.formState.errors.password]} />
        )}
      </div>

      {/* Confirm Password */}
      <div className="w-full space-y-1">
        <Label className="leading-5" htmlFor="confirmPassword">
          Confirm Password*
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={isConfirmPasswordVisible ? "text" : "password"}
            placeholder="••••••••••••••••"
            className="pr-9"
            {...form.register("confirmPassword")}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setIsConfirmPasswordVisible((prevState) => !prevState)
            }
            className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
          >
            {isConfirmPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
            <span className="sr-only">
              {isConfirmPasswordVisible ? "Hide password" : "Show password"}
            </span>
          </Button>
        </div>
        {form.formState.errors.confirmPassword && (
          <FieldError errors={[form.formState.errors.confirmPassword]} />
        )}
      </div>

      <Button className="w-full" type="submit">
        Set New Password
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
