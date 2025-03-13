import { Logo } from "@/components/logo";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto flex h-screen flex-col px-4">
      <header className="flex items-center justify-between border-b bg-white p-6">
        <div aria-labelledby="logo" className="flex items-center gap-1">
          <Logo />

          <Link href="/" className="text-xl font-bold">
            knowsay
          </Link>
        </div>
        <nav className="flex items-center">
          <div className="hidden md:flex">
            <AccountMenu />
          </div>
          <Button className="p-2 md:hidden">
            <Menu />
          </Button>
        </nav>
      </header>

      <section className="flex justify-between bg-gray-50 py-4">
        <Button variant="link" className="flex items-center gap-2 px-6">
          <Avatar>
            <AvatarImage src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">Learner</span>
        </Button>
        {/* button group */}
        <div className="flex gap-4 px-6">
          <Button
            variant="outline"
            className="border-2 border-dashed border-gray-300 p-4 hover:cursor-pointer hover:bg-gray-100"
          >
            Create Quizz
          </Button>
          <Button
            variant="outline"
            className="border-2 border-dashed border-gray-300 p-4 hover:cursor-pointer hover:bg-gray-100"
          >
            Create Challenge
          </Button>
          <Button
            variant="outline"
            className="border-2 border-dashed border-gray-300 p-4 hover:cursor-pointer hover:bg-gray-100"
          >
            Create Test
          </Button>
        </div>
      </section>

      <Separator />

      <section className="mt-8">{children}</section>
    </div>
  );
}

const AccountMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="gap-2" asChild>
        <Button variant="outline" className="py-4">
          Account
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
