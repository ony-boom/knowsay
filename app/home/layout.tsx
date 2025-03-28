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
                <NavigationMenuTrigger className="bg-background hover:bg-muted flex items-center gap-2">
                  <Avatar className="border-primary/10 h-8 w-8 border-2">
                    <AvatarImage
                      src={
                        user?.imageUrl ??
                        "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
                      }
                      alt={user?.firstName || "User"}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user?.firstName?.charAt(0) ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">Learner</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[320px] rounded-xl border shadow-lg backdrop-blur-sm">
                  <div className="border-b p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="border-primary/10 h-12 w-12 border-2">
                        <AvatarImage
                          src={
                            user?.imageUrl ??
                            "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
                          }
                          alt={user?.firstName || "User"}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user?.firstName?.charAt(0) ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h4 className="text-base font-semibold">
                          {user?.firstName || "User"} {user?.lastName || ""}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {user?.emailAddresses[0]?.emailAddress ||
                            "user@example.com"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <ul className="flex flex-col gap-2 p-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/home/profile"
                          className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex flex-col items-start rounded-md p-3 text-sm transition-colors outline-none"
                        >
                          <div className="font-medium">My Profile</div>
                          <p className="text-muted-foreground text-xs">
                            Manage your profile settings
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/home/my-quiz"
                          className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex flex-col items-start rounded-md p-3 text-sm transition-colors outline-none"
                        >
                          <div className="font-medium">My Quizzes</div>
                          <p className="text-muted-foreground text-xs">
                            View and manage your quizzes
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/home/challenges"
                          className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex flex-col items-start rounded-md p-3 text-sm transition-colors outline-none"
                        >
                          <div className="font-medium">My Challenges</div>
                          <p className="text-muted-foreground text-xs">
                            Access your created challenges
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/home/tests"
                          className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex flex-col items-start rounded-md p-3 text-sm transition-colors outline-none"
                        >
                          <div className="font-medium">My Tests</div>
                          <p className="text-muted-foreground text-xs">
                            Review and edit your tests
                          </p>
                        </Link>
                      </NavigationMenuLink>
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
