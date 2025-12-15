import { ChevronLeftIcon } from "lucide-react";

import { Separator } from "@/components/ui/separator";

import { BorderBeam } from "@/components/ui/border-beam";

import Logo from "@/components/logo";
import AuthFullBackgroundShape from "@/assets/svg/auth-full-background-shape";
import LoginForm from "@/components/login/login-form";
import Link from "next/link";
import SigninGithubButton from "@/components/signin-github-button";
import SigninGoogleButton from "@/components/signin-google-button";

const Login = () => {
  return (
    <div className="h-dvh lg:grid lg:grid-cols-6">
      {/* Dashboard Preview */}
      <div className="max-lg:hidden lg:col-span-3 xl:col-span-4">
        <div className="bg-muted relative z-1 flex h-full items-center justify-center px-6">
          <div className="outline-border relative shrink rounded-[20px] p-2.5 outline-2 -outline-offset-[2px]">
            <img
              src="https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/auth/image-1.png"
              className="max-h-111 w-full rounded-lg object-contain dark:hidden"
              alt="Dashboards"
            />
            <img
              src="https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/auth/image-1-dark.png"
              className="hidden max-h-111 w-full rounded-lg object-contain dark:inline-block"
              alt="Dashboards"
            />

            <BorderBeam duration={8} borderWidth={2} size={100} />
          </div>

          <div className="absolute -z-1">
            <AuthFullBackgroundShape />
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex h-full flex-col items-center justify-center py-10 sm:px-5 lg:col-span-3 xl:col-span-2">
        <div className="w-full max-w-md px-6">
          <Link
            href="/"
            className="text-muted-foreground group mb-12 flex items-center gap-2 sm:mb-16 lg:mb-24"
          >
            <ChevronLeftIcon className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            <p>Back to the website</p>
          </Link>

          <div className="flex flex-col gap-6">
            <Logo className="gap-3" />

            <div>
              <h2 className="mb-1.5 text-2xl font-semibold">
                Sign in to Next Blog
              </h2>
              <p className="text-muted-foreground">
                Ship Faster and Focus on Growth.
              </p>
            </div>

            <p className="text-muted-foreground">
              Login with{" "}
              <Link
                href="/login/magiclink"
                className="text-foreground hover:underline"
              >
                Magic Link
              </Link>
            </p>

            {/* Form */}
            <LoginForm />

            <div className="space-y-4">
              <p className="text-muted-foreground text-center">
                New on our platform?{" "}
                <Link
                  href="register"
                  className="text-foreground hover:underline"
                >
                  Create an account
                </Link>
              </p>

              <div className="flex items-center gap-4">
                <Separator className="flex-1" />
                <p>or</p>
                <Separator className="flex-1" />
              </div>

              <SigninGithubButton />
              <SigninGoogleButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
