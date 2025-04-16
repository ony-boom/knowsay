"use client";

import { AuthButtons } from "@/components/auth";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const t = useTranslations("index");
  
  useEffect(() => {
    if (status === "authenticated") {
      redirect("/home");
    }
  }, [status]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-20 md:flex-row md:justify-between lg:gap-32">
      <hgroup className="space-y-4 md:max-w-lg lg:space-y-6">
        <h1 className="text-3xl font-black lg:text-5xl lg:leading-12">
          {t("title")}
        </h1>
        <p className="text-foreground/80 text-lg">{t("description")}</p>

        <AuthButtons>{t("cta")}</AuthButtons>
      </hgroup>

      <div className="relative flex gap-12 md:grow">
        <div className="relative flex gap-4 overflow-hidden md:gap-6">
          <Image
            alt="Interactive quiz"
            src="/home-hero.png"
            width={400}
            height={400}
            className="xl:scale-80"
          />

          <Image
            alt="Interactive quiz"
            src="/home-hero-2.png"
            width={400}
            height={400}
            className="hidden -translate-y-20 scale-80 duration-300 xl:block"
          />
        </div>

        {/* Bottom fade effect */}
        <div className="from-background pointer-events-none absolute right-0 -bottom-4 left-0 h-24 bg-gradient-to-t to-transparent" />
      </div>
    </div>
  );
}
