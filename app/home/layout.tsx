"use client";

import { Logo } from "@/components/logo";
import Link from "next/link";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import { HomeBreadcrumb } from "@/components/home-breadcrumb";
import { ReactNode } from "react";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { LanguageSwitch } from "@/components/language-switch";
import { useTranslations } from "next-intl";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { user } = useUser();
  const pathname = usePathname();
  const t = useTranslations();

  const isAtHomeRoot = pathname === "/home";

  return (
    <div className="container mx-auto flex h-screen flex-col px-4">
      <div className="bg-background sticky top-0 z-50">
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
              <SignOutButton>
                <Button size="icon" variant="ghost" className="p-0">
                  <LogOut />
                </Button>
              </SignOutButton>
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

          <NavigationMenu className="px-6">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        user?.imageUrl ??
                        "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
                      }
                    />
                    <AvatarFallback>
                      {user?.firstName?.charAt(0) ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {user?.firstName || "User"}
                  </span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-1 p-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/home/account"
                          className="flex items-center gap-2"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user?.imageUrl ?? ""} />
                            <AvatarFallback>
                              {user?.firstName?.charAt(0) ?? "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span>My Profile</span>
                            <span className="text-muted-foreground text-xs">
                              Manage your account settings
                            </span>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/home/quizzes"
                          className="flex items-center gap-2"
                        >
                          <div className="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full">
                            <span className="text-primary text-xs">Q</span>
                          </div>
                          <div className="flex flex-col">
                            <span>My Quizzes</span>
                            <span className="text-muted-foreground text-xs">
                              View and manage your quizzes
                            </span>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/home/challenges"
                          className="flex items-center gap-2"
                        >
                          <div className="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full">
                            <span className="text-primary text-xs">C</span>
                          </div>
                          <div className="flex flex-col">
                            <span>My Challenges</span>
                            <span className="text-muted-foreground text-xs">
                              Access your created challenges
                            </span>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/home/tests"
                          className="flex items-center gap-2"
                        >
                          <div className="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full">
                            <span className="text-primary text-xs">T</span>
                          </div>
                          <div className="flex flex-col">
                            <span>My Tests</span>
                            <span className="text-muted-foreground text-xs">
                              Review and edit your tests
                            </span>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li className="mt-2 border-t pt-2">
                      <SignOutButton>
                        <NavigationMenuLink className="text-destructive flex w-full cursor-pointer items-center gap-2">
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </NavigationMenuLink>
                      </SignOutButton>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {isAtHomeRoot && (
            <div className="flex flex-col gap-4 px-6 sm:flex-row">
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
                asChild
                variant="outline"
                className="hover:cursor-pointe border-2 border-dashed border-neutral-300 p-4"
              >
                <Link href="/home/challenge/create">
                  {t("home.toolbar.buttons.createChallenge")}
                </Link>
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

      <div className="w-full py-6">{children}</div>
    </div>
  );
}
