"use client";

import { Logo } from "@/components/logo";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AccountMenu } from "@/components/account-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAtHomeRoot = pathname === "/home";

  return (
    <div className="container mx-auto flex h-screen flex-col px-4">
      <header className="bg-background flex items-center justify-between border-b p-6">
        <div aria-labelledby="logo" className="flex items-center gap-1">
          <Logo />

          <Link href="/" className="text-2xl font-bold">
            knowsay
          </Link>
        </div>
        <nav className="flex items-center">
          <div className="hidden md:flex">
            <AccountMenu />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full md:hidden"
          >
            <Menu />
          </Button>
        </nav>
      </header>

      <section className="flex justify-between bg-neutral-50-50 py-4">
        <Button variant="link" className="flex items-center gap-2 px-6">
          <Avatar>
            <AvatarImage src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">Learner</span>
        </Button>

        {isAtHomeRoot && (
          <div className="flex gap-4 px-6">
            <Button
              variant="outline"
              className="border-2 border-dashed border-neutral-300 p-4 hover:cursor-pointer"
            >
              Create Quiz
            </Button>
            <Button
              variant="outline"
              className="border-2 border-dashed border-neutral-300 p-4 hover:cursor-pointe"
            >
              Create Challenge
            </Button>
            <Button
              variant="outline"
              className="border-2 border-dashed border-neutral-50-300 p-4 hover:cursor-pointer"
            >
              Create Test
            </Button>
          </div>
        )}
      </section>

      <Separator />

      <section className="mt-8">{children}</section>
    </div>
  );
}
