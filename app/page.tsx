import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";

export default function Home() {
  return (
    <Container className="flex h-screen flex-col">
      <nav className="bg-background sticky top-0 flex items-center justify-between py-4">
        <div aria-labelledby="logo" className="flex items-center gap-1">
          <Logo />

          <Link href="/" className="text-xl font-bold">
            knowsay
          </Link>
        </div>

        <div>
          <Button asChild>
            <Link href="/auth/login">Get started</Link>
          </Button>
        </div>
      </nav>
    </Container>
  );
}
