"use client";

import { useState } from "react";

import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldError } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    username: z
      .string()
      .min(3, "At least 3 character expected")
      .max(20, "Could not exceed 20 character")
      .regex(/^[a-zA-Z0-9_]+$/, "Only letter, digit and underscore allowed"),
    email: z.email("Email must be valid"),
    password: z
      .string()
      .min(8, "At least  8 character expected")
      .max(30, "Could not exceed 30 characters")
      .regex(/[A-Z]/, "At least one uppercase expected")
      .regex(/[a-z]/, "At least one lowercase expected")
      .regex(/[0-9]/, "At least one digit expected")
      .regex(/[!@#$%^&*]/, "At least one symbol expected"),
    confirmPassword: z.string(),
    privacyPolicy: z
      .boolean()
      .refine((val) => val === true, "you must agree with privacy policy"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const RegisterForm = () => {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      privacyPolicy: false,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("You submitted values", JSON.stringify(data, null, 2));
    const res = await authClient.signUp.email({
      name: data.username,
      email: data.email,
      password: data.password,
    });

    if (res.error === null) {
      router.push("/");
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      {/* Username */}
      <Controller
        name="username"
        control={form.control}
        render={({ field, fieldState }) => (
          <div className="space-y-1">
            <Label className="leading-5" htmlFor="username">
              Username*
            </Label>
            <Input
              {...field}
              type="text"
              id="username"
              placeholder="Enter your username"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </div>
        )}
      />

      {/* Email */}
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <div className="space-y-1">
            <Label className="leading-5" htmlFor="email">
              Email address*
            </Label>
            <Input
              {...field}
              type="email"
              id="emain"
              placeholder="Enter your email address"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </div>
        )}
      />

      {/* Password */}
      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <div className="w-full space-y-1">
            <Label className="leading-5" htmlFor="password">
              Password*
            </Label>
            <div className="relative">
              <Input
                {...field}
                id="password"
                type={isPasswordVisible ? "text" : "password"}
                placeholder="••••••••••••••••"
                className="pr-9"
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
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </div>
        )}
      />

      {/* Confirm Password */}
      <Controller
        name="confirmPassword"
        control={form.control}
        render={({ field, fieldState }) => (
          <div className="w-full space-y-1">
            <Label className="leading-5" htmlFor="confirmPassword">
              Confirm Password*
            </Label>
            <div className="relative">
              <Input
                {...field}
                id="confirmPassword"
                type={isConfirmPasswordVisible ? "text" : "password"}
                placeholder="••••••••••••••••"
                className="pr-9"
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
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </div>
        )}
      />

      {/* Privacy policy */}
      <Controller
        name="privacyPolicy"
        control={form.control}
        render={({ field, fieldState }) => (
          <div className="flex items-center gap-3">
            <Checkbox
              id="privacyPolicy"
              className="size-6"
              name="privacyPolicy"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="privacyPolicy">
              I agree to privacy policy & terms
            </Label>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </div>
        )}
      />

      <Button
        className="w-full"
        type="submit"
        disabled={!form.formState.dirtyFields.privacyPolicy}
      >
        Sign Up to Shadcn Studio
      </Button>
    </form>
  );
};

export default RegisterForm;
