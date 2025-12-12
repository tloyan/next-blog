"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({ email: z.email() });

const ForgotPasswordForm = () => {
  const form = useForm({ resolver: zodResolver(formSchema) });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const res = await authClient.requestPasswordReset({
      email: data.email,
      redirectTo: `${process.env.NEXT_PUBLIC_URL}/reset-password`,
    });

    if (res.error) {
      toast("something is wrong");
    } else toast("A reset password email has been send");
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
      </div>

      <Button className="w-full" type="submit">
        Send Reset Link
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
