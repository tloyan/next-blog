"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function SigninGithubButton() {
  return (
    <Button
      variant="ghost"
      className="w-full"
      onClick={() => authClient.signIn.social({ provider: "github" })}
    >
      Sign in with github
    </Button>
  );
}
