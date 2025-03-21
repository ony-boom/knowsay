"use client";

import { Logo } from "@/components/logo";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AccountMenu } from "@/components/account-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import { HomeBreadcrumb } from "@/components/home-breadcrumb";
import { ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { LanguageSwitch } from "@/components/language-switch";
import { useTranslations } from "next-intl";

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { user } = useUser();
  const pathname = usePathname();
  const t = useTranslations();

  const isAtHomeRoot = pathname === "/home";

  return (
    <div className="container mx-auto flex h-screen flex-col px-4">
      <div className="sticky top-0 bg-background z-50">
        <header className="flex items-center justify-between border-b py-4 sm:p-6">
          <div aria-labelledby="logo" className="flex items-center gap-1">
            <Logo />

            <Link href="/" className="text-lg font-bold sm:text-2xl">
              knowsay
            </Link>
          </div>
          <nav className="flex items-center gap-2 md:gap-4">
            <LanguageSwitch />
            <div className="hidden md:flex">
              <AccountMenu />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full md:hidden"
            >
              <Menu />
            </Button>
          </nav>
        </header>

        <section className="bg-neutral-50-50 flex items-center justify-between py-4">
          {!isAtHomeRoot && <HomeBreadcrumb />}

          <Button variant="link" className="flex items-center gap-2 px-6">
            <Avatar>
              <AvatarImage
                src={
                  user?.imageUrl ??
                  "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
                }
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center justify-center">
              <span className="text-accent-foreground text-sm font-medium md:inline-block">
                {user?.firstName}
              </span>
            </div>
          </Button>

          {isAtHomeRoot && (
            <div className="flex gap-4 px-6">
              <Button
                asChild
                variant="outline"
                className="border-2 border-dashed border-neutral-300 p-4 hover:cursor-pointer"
              >
                <Link href="/home/quiz/create">
                  {t("home.toolbar.buttons.createQuiz")}
                </Link>
              </Button>
              <Button
                variant="outline"
                className="hover:cursor-pointe border-2 border-dashed border-neutral-300 p-4"
              >
                {t("home.toolbar.buttons.createChallenge")}
              </Button>
              <Button
                variant="outline"
                className="border-neutral-50-300 border-2 border-dashed p-4 hover:cursor-pointer"
              >
                {t("home.toolbar.buttons.createTest")}
              </Button>
            </div>
          )}
        </section>

        <Separator />
      </div>

      <div className="w-full py-8 pr-3">{children}</div>
    </div>
  );
}
