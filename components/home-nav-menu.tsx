"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";

export function HomeNavMenu() {
  return (
    <div>
      <div id="desktop-nav" className="hidden items-center gap-4 md:flex">
        <Button asChild variant="outline">
          <Link href="/app/(home)/auth/login">Login</Link>
        </Button>

        <Button asChild>
          <Link href="/app/(home)/auth/signup">Sign up</Link>
        </Button>
      </div>

      <div className="md:hidden">
        <MobileNavMenu />
      </div>
    </div>
  );
}

const MobileNavMenu = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const pathname = usePathname();

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
            className="bg-background absolute inset-0 top-16 z-0 w-full space-y-2 p-4"
          >
            <Button asChild className="w-full">
              <Link href="/auth/signup">Sign up</Link>
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/login">Login</Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
