"use client";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

import ProfileDropdown from "@/components/dropdown-profile";

import Logo from "@/components/logo";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type NavigationItem = {
  title: string;
  href: string;
}[];

const Header = ({ navigationData }: { navigationData: NavigationItem }) => {
  const { data: session } = authClient.useSession();

  return (
    <header className="bg-background sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-7 sm:px-6">
        <Link href="/">
          <Logo className="gap-3" />
        </Link>

        <div className="flex items-center gap-6">
          <div className="text-muted-foreground flex items-center gap-6 font-medium max-md:hidden">
            {navigationData.map((item, index) => (
              <Link key={index} href={item.href} className="hover:text-primary">
                {item.title}
              </Link>
            ))}
          </div>

          <Separator orientation="vertical" className="!h-6 max-md:hidden" />

          <DropdownMenu>
            <DropdownMenuTrigger className="md:hidden" asChild>
              <Button variant="outline" size="icon">
                <MenuIcon />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                {navigationData.map((item, index) => (
                  <DropdownMenuItem key={index}>
                    <Link href={item.href}>{item.title}</Link>
                  </DropdownMenuItem>
                ))}
                {!session && (
                  <>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="!bg-transparent">
                      <Button className="grow" asChild>
                        <Link href="/login">Login</Link>
                      </Button>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {session ? (
            <ProfileDropdown
              trigger={
                <Button variant="ghost" className="h-full p-0">
                  <Avatar className="size-9.5 rounded-md">
                    <AvatarImage src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              }
            />
          ) : (
            <Button
              className="rounded-lg text-base max-md:hidden"
              size="lg"
              asChild
            >
              <Link href="login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
