"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { FieldError } from "../ui/field";

const magiclinkFormSchema = z.object({
  email: z.email("should be valid email"),
});

const MagicLinkForm = () => {
  const form = useForm({
    resolver: zodResolver(magiclinkFormSchema),
  });

  async function onSubmit(data: z.infer<typeof magiclinkFormSchema>) {
    await authClient.signIn.magicLink({
      email: data.email, // required
      callbackURL: "/",
      newUserCallbackURL: "/",
      errorCallbackURL: "/login/magiclink/error",
    });
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      {/* Email */}
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

      <Button className="w-full" type="submit">
        Sign in to Next-Blog
      </Button>
    </form>
  );
};

export default MagicLinkForm;
