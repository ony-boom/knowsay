"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LanguageSwitch } from "@/components/language-switch";
import { useTranslations } from "next-intl";

export function HomeNavMenu() {
  const pathname = usePathname();
  const isLogin = pathname === "/auth/login";
  const isSignup = pathname === "/auth/sign-up";

  const t = useTranslations("global");

  return (
    <>
      <div id="desktop-nav" className="hidden items-center gap-4 md:flex">
        <LanguageSwitch />
        <Button asChild className={cn({ hidden: isSignup })}>
          <Link href="/auth/sign-up">{t("signUp")}</Link>
        </Button>

        <Button asChild variant="outline" className={cn({ hidden: isLogin })}>
          <Link href="/auth/login">{t("login")}</Link>
        </Button>
      </div>

      <div className="flex items-center gap-4 md:hidden">
        <LanguageSwitch />
        <MobileNavMenu />
      </div>
    </>
  );
}

const MobileNavMenu = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const pathname = usePathname();

  const isLogin = pathname === "/auth/login";
  const isSignup = pathname === "/auth/sign-up";
  const t = useTranslations("global");

  const handleMenuToggle = () => {
    setOpenMenu((prev) => !prev);
  };

  useEffect(() => {
    setOpenMenu(false);
  }, [pathname]);

  return (
    <>
      <Button
        size="icon"
        className="rounded-full"
        variant="ghost"
        onClick={handleMenuToggle}
      >
        {openMenu ? <X /> : <Menu />}
      </Button>

      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="bg-background absolute inset-0 top-16 h-max w-full space-y-2 rounded-lg p-4 shadow-2xs"
          >
            <Button
              asChild
              className={cn("w-full", {
                hidden: isSignup,
              })}
            >
              <Link href="/auth/sign-up">{t("signUp")}</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className={cn("w-full", { hidden: isLogin })}
            >
              <Link href="/auth/login">{t("login")}</Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
