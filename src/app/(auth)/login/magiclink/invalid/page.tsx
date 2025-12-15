import { ChevronLeftIcon } from "lucide-react";

import { BorderBeam } from "@/components/ui/border-beam";

import Logo from "@/components/logo";
import AuthFullBackgroundShape from "@/assets/svg/auth-full-background-shape";
import Link from "next/link";
import MagicLinkForm from "@/components/login/magiclink-form";
import { Button } from "@/components/ui/button";

const MagicLinkInvalid = () => {
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

      {/* Invalid Magic Link */}
      <div className="flex h-full flex-col items-center justify-center py-10 sm:px-5 lg:col-span-3 xl:col-span-2">
        <div className="w-full max-w-md px-6">
          <div className="flex flex-col gap-6">
            <Logo className="gap-3" />

            <div>
              <h2 className="mb-1.5 text-2xl font-semibold">
                This link is not valid anymore
              </h2>
              <p className="text-muted-foreground">
                Click below to send new Magic Link
              </p>
            </div>

            <Link
              href="/login/magiclink"
              className="text-foreground hover:underline"
            >
              Magic Link
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagicLinkInvalid;
