import Link from "next/link";
import { Logo } from "@/components/logo";
import { Container } from "@/components/container";
import { HomeNavMenu } from "@/components/home-nav-menu";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsentModal } from "@/components/cookie-consent-modal";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <Container className="flex h-screen flex-col">
      <nav className="bg-background sticky top-0 z-50 flex items-center justify-between py-4">
        <div aria-labelledby="logo" className="flex items-center gap-1">
          <Logo />

          <Link href="/" className="text-2xl font-bold">
            knowsay
          </Link>
        </div>

        <HomeNavMenu />
      </nav>
      <div className="grow py-2">{children}</div>
      <Toaster />
      <CookieConsentModal />
    </Container>
  );
}
