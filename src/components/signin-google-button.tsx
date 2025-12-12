"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function SigninGoogleButton() {
  return (
    <Button
      variant="ghost"
      className="w-full"
      onClick={() => authClient.signIn.social({ provider: "google" })}
    >
      Sign in with google
    </Button>
  );
}
