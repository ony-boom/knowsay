"use client";

import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { AuthButtons } from "@/components/auth";

export default function Home() {
  const { isSignedIn } = useAuth();
  if (isSignedIn) redirect("/dashboard");

  return (
    <div className="flex h-full flex-col items-center justify-center gap-20 md:flex-row md:justify-between lg:gap-32">
      <hgroup className="space-y-4 md:max-w-lg lg:space-y-6">
        <h1 className="text-3xl font-black lg:text-5xl lg:leading-12">
          Create, share, and discover knowledge with Knowsay.
        </h1>
        <p className="text-foreground/80 text-lg">
          Knowsay is a platform for sharing knowledge in the form of questions
          and answers(Quizzes). Join us on this journey to make learning fun and
          interactive.
        </p>

        <AuthButtons />
      </hgroup>

      <div className="relative flex gap-12 md:grow">
        <div className="relative flex gap-4 md:gap-6">
          <Image
            alt="Interactive quizzes"
            src="/home-hero.png"
            width={400}
            height={400}
            className="xl:scale-80"
          />

          <Image
            alt="Interactive quizzes"
            src="/home-hero-2.png"
            width={400}
            height={400}
            className="hidden -translate-y-20 scale-80 duration-300 xl:block"
          />

          <Image
            alt="Interactive quizzes"
            src="/home-hero-3.png"
            width={400}
            height={400}
            className="hidden -translate-x-12 translate-y-4 xl:block"
          />
        </div>

        {/* Bottom fade effect */}
        <div className="from-background pointer-events-none absolute right-0 -bottom-4 left-0 h-24 bg-gradient-to-t to-transparent" />

        {/* Right side fade effect for desktop */}
        <div className="from-background pointer-events-none absolute top-0 right-0 bottom-0 hidden w-24 bg-gradient-to-l to-transparent md:block" />
      </div>
    </div>
  );
}
