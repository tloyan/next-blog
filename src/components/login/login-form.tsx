"use client";

import { useState } from "react";

import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { FieldError } from "../ui/field";
import Link from "next/link";
import { useRouter } from "next/navigation";

const loginFormSchema = z.object({
  email: z.email("should be valid email"),
  password: z.string().nonempty("is required"),
  rememberMe: z.boolean(),
});

const LoginForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  async function onSubmit(data: z.infer<typeof loginFormSchema>) {
    const res = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
    });

    if (res.error) {
      form.setError("root", {
        type: "custom",
        message: "password and/or email are invalid",
      });
    } else router.push("/");
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      {/* Email */}
      {form.formState.errors.root && (
        <FieldError errors={[form.formState.errors.root]} />
      )}
      <div className="space-y-1">
        <Label className="leading-5" htmlFor="userEmail">
          Email address*
        </Label>
        <Input
          type="email"
          id="userEmail"
          placeholder="Enter your email address"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <FieldError errors={[form.formState.errors.email]} />
        )}
      </div>

      {/* Password */}
      <div className="w-full space-y-1">
        <Label className="leading-5" htmlFor="password">
          Password*
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={isVisible ? "text" : "password"}
            placeholder="••••••••••••••••"
            className="pr-9"
            {...form.register("password")}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible((prevState) => !prevState)}
            className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
          >
            {isVisible ? <EyeOffIcon /> : <EyeIcon />}
            <span className="sr-only">
              {isVisible ? "Hide password" : "Show password"}
            </span>
          </Button>
        </div>
        {form.formState.errors.password && (
          <FieldError errors={[form.formState.errors.password]} />
        )}
      </div>

      {/* Remember Me and Forgot Password */}
      <div className="flex items-center justify-between gap-y-2">
        <Controller
          name="rememberMe"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center gap-3">
              <Checkbox
                id="rememberMe"
                className="size-6"
                name="rememberMe"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="rememberMe"> Remember Me</Label>
            </div>
          )}
        />

        <Link href="forgot-password" className="hover:underline">
          Forgot Password?
        </Link>
      </div>

      <Button className="w-full" type="submit">
        Sign in to Next-Blog
      </Button>
    </form>
  );
};

export default LoginForm;
