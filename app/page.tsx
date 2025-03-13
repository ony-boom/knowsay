import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { HomeNavMenu } from "@/components/home-nav-menu";

export default function Home() {
  return (
    <Container className="flex h-screen flex-col">
      <nav className="bg-background sticky top-0 flex items-center justify-between py-4 z-50">
        <div aria-labelledby="logo" className="flex items-center gap-1">
          <Logo />

          <Link href="/" className="text-2xl font-bold">
            knowsay
          </Link>
        </div>

        <HomeNavMenu />
      </nav>
    </Container>
  );
}
