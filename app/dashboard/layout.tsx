import { Logo } from "@/components/logo";
import Link from "next/link";
import { Menu } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto flex h-screen flex-col">
      <header className="flex items-center justify-between border-b bg-white p-6">
        <div aria-labelledby="logo" className="flex items-center gap-1">
          <Logo />

          <Link href="/" className="text-xl font-bold">
            knowsay
          </Link>
        </div>
        <nav className="flex items-center">
          <div className="hidden md:flex">
            {/* Desktop navigation items can go here */}
            <Link href="/dashboard" className="px-4 py-2 hover:text-gray-600">
              Dashboard
            </Link>
            <Link href="/profile" className="px-4 py-2 hover:text-gray-600">
              Profile
            </Link>
          </div>
          <button className="p-2 md:hidden">
            <Menu />
          </button>
        </nav>
      </header>
      {children}
    </div>
  );
}
